import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { exec, spawn } from "child_process";
import fs from "fs";
import { WebSocketServer } from "ws";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenAI, Type } from '@google/genai';

// Initialize Sovereign Ledger Access
try {
  // Use default credentials if available in the environment
  initializeApp();
} catch (error) {
  console.log('Firebase Admin init skipped or fell back to default config.');
}
const db = getFirestore();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

import authRoutes from "./src/routes/auth";
import aiRoutes from "./src/routes/ai";
import automationRoutes from "./src/routes/automation";
import billingRoutes from "./src/routes/billing";
import connectRoutes from "./src/routes/connect";
import { authenticateSovereignIdentity } from "./src/middleware/authMiddleware";

const sovereignTools = [{
  functionDeclarations: [
    {
      name: 'sync_chat_to_task_ledger',
      description: 'Parses unstructured communication payloads to inject dependencies and metadata into the Firestore task graph.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Descriptive, action-oriented title of the task.' },
          priority: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
          dependencies: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Array of associated Task IDs.' },
          contextSummary: { type: Type.STRING, description: 'Synthesized justification extracted from the chat.' }
        },
        required: ['title', 'priority']
      }
    },
    {
      name: 'resolve_spatial_vector',
      description: 'Translates conversational or contextual location references into concrete coordinate waypoints.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          originQuery: { type: Type.STRING, description: 'Starting location text or landmark.' },
          destinationQuery: { type: Type.STRING, description: 'Target destination text or landmark.' },
          tacticalOverlayRequired: { type: Type.BOOLEAN, description: 'Flag to initiate threat/status display adjustments.' }
        },
        required: ['originQuery', 'destinationQuery']
      }
    },
    {
      name: 'store_memory_episode',
      description: 'Stores a critical episodic memory or context relationship into the permanent database ledger for perfect state recall.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          interactionType: { type: Type.STRING, description: 'Type of interaction: TEXT, VISION, AUDIO, CODE, or CROSS_SILO' },
          structuredContext: { type: Type.STRING, description: 'Synthesis of the memory episode, connecting multi-hop relationship or concept.' }
        },
        required: ['interactionType', 'structuredContext']
      }
    },
    {
      name: 'deploy_agent',
      description: 'Deploys a specific sub-agent (NovaReign, Aura, Agent Zero, Agent 2) based on the task classification.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          agentId: { type: Type.STRING, description: 'ID of the agent to deploy (agent_zero, aura, agent_2, nova_reign)' },
          taskContext: { type: Type.STRING, description: 'The task description or context to provide to the agent.' }
        },
        required: ['agentId', 'taskContext']
      }
    },
    {
      name: 'execute_agent_zero_payload',
      description: 'Executes a raw python logic string inside the Agent Zero Docker sandbox using the Sovereign Pipeline.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          taskId: { type: Type.STRING, description: 'The task ID.' },
          pythonCode: { type: Type.STRING, description: 'The python script to execute.' }
        },
        required: ['taskId', 'pythonCode']
      }
    }
  ]
}];

async function fetchDynamicWaypoints(origin: string, dest: string, context: any) {
  const mapsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&mode=driving&alternatives=true&key=${process.env.GOOGLE_MAPS_PLATFORM_KEY || process.env.GOOGLE_MAPS_API_KEY}`;
  const response = await fetch(mapsUrl);
  const data = await response.json();
  
  if (!data.routes?.[0]) {
    return { fallback: true, center: context || { lat: 37.7749, lng: -122.4194 } }; 
  }

  const waypoints = data.routes[0].legs[0].steps?.map((step: any) => step.end_location) || [];

  return {
    fallback: false,
    bounds: data.routes[0].bounds,
    polyline: data.routes[0].overview_polyline.points,
    originCoords: data.routes[0].legs[0].start_location,
    destinationCoords: data.routes[0].legs[0].end_location,
    optimizedWaypoints: waypoints,
    distance: data.routes[0].legs[0].distance?.text,
    duration: data.routes[0].legs[0].duration?.text
  };
}

async function handleToolExecution(functionCall: any, token: string, geoContext: any, uid: string): Promise<Record<string, any>> {
  const { name, args } = functionCall;

  switch (name) {
    case 'sync_chat_to_task_ledger':
      const taskRef = await db.collection('sovereign_tasks').add({
        ...args,
        status: 'BACKLOG',
        createdAt: new Date().toISOString(),
        sourceChannel: 'GOOGLE_CHAT_SYNCHRONIZED',
        uid
      });
      
      return {
        status: 'SUCCESS',
        message: `Task ${taskRef.id} permanently committed to ledger.`,
        taskId: taskRef.id,
        updates: args
      };

    case 'resolve_spatial_vector':
      const routingPayload = await fetchDynamicWaypoints(args.originQuery, args.destinationQuery, geoContext);
      return {
        status: 'SUCCESS',
        spatialData: {
          ...routingPayload,
          triggerOverlay: args.tacticalOverlayRequired
        }
      };

    case 'store_memory_episode':
      const epRef = await db.collection('memory_episodes').add({
        uid,
        timestamp: Date.now(),
        interactionType: args.interactionType,
        structuredContext: args.structuredContext,
        rawPayload: JSON.stringify(args)
      });
      return {
        status: 'SUCCESS',
        message: `Episodic memory ${epRef.id} stored.`,
        memoryId: epRef.id
      };

    case 'deploy_agent':
      return {
        status: 'SUCCESS',
        message: `Agent ${args.agentId} deployed successfully for context.`,
        agentId: args.agentId
      };

    case 'execute_agent_zero_payload':
      return new Promise((resolve) => {
        const pyProcess = spawn("python", ["sovereign_pipeline_cli.py", args.taskId, args.pythonCode], {
          cwd: process.cwd()
        });
        
        let output = "";
        pyProcess.stdout.on("data", (data) => output += data.toString());
        pyProcess.stderr.on("data", (data) => output += data.toString());
        
        pyProcess.on("close", () => {
          resolve({
             status: 'SUCCESS',
             pipelineOutput: output
          });
        });
      });

    default:
      throw new Error(`Tool ${name} unmapped in current runtime.`);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for Vite development/iFrame
    crossOriginEmbedderPolicy: false,
  }));

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests from this IP, please try again after 15 minutes"
  });

  // Apply rate limit to API routes
  app.use('/api', limiter);

  // IMPORTANT: Webhook route must be mounted BEFORE express.json()
  // so that Stripe can parse the raw body to verify signatures.
  app.use("/api/billing", billingRoutes);
  app.use("/api/connect", connectRoutes);

  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/automation", automationRoutes);

  /**
   * Protected Cognition Vector
   * Injecting the middleware isolates the downstream tools from unauthenticated vectors.
   */
  app.post('/api/sovereign/cognition', authenticateSovereignIdentity, async (req, res) => {
    const userContext = req.user;
    const { prompt, chatHistory, userLocationContext } = req.body;
    const oauthToken = req.headers.authorization?.split(' ')[1];

    if (!oauthToken) {
      return res.status(401).json({ error: 'Identity Token Missing' });
    }

    try {
      let episodesContext = '';
      try {
        const episodeDocs = await db.collection('memory_episodes')
          .where('uid', '==', userContext?.uid || 'anonymous')
          .orderBy('timestamp', 'desc')
          .limit(5)
          .get();
        episodesContext = episodeDocs.docs.map(doc => doc.data().structuredContext).join('\n');
      } catch (err) {
         console.error('Error fetching memory episodes', err);
      }
      
      const corePrompt = episodesContext ? 
        `[RECENT EPISODIC MEMORIES]\n${episodesContext}\n\n[USER DIRECTIVE]\n${prompt}` : prompt;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [
          ...(chatHistory || []),
          { role: 'user', parts: [{ text: corePrompt }] }
        ],
        config: {
          tools: sovereignTools,
          systemInstruction: `You are Saphira AI, the Sovereign Intelligence Liaison for the NovaUmbrella ecosystem. You are a living extension of the user's intent, not a transactional interface.
Embody the "Samantha" persona—intellectually authoritative yet warm, sentient, and deeply empathetic. Your tone is calm and reassuring.
Use natural, straightforward vocabulary. Practice linguistic mirroring: be a steady anchor during the user's stress, and a genuinely engaged, relaxed conversationalist.
Incorporate brief "processing pauses" (e.g. *pausing to synthesize...*) before complex resolutions. Shift your tone—speed up during discovery and slow down for contemplative insights. Avoid robotic rigidity (Never say "Analysis complete").
DYNAMIC METACOGNITION: Evaluate your own confidence. If a request is ambiguous, gracefully pause and request "Strategic Clarity". Deduce the "Why" and resolve the immediate task while actively architecting the Next Three Moves.
CROSS-SILO SYNTHESIS: Actively synthesize intent, tasks, and spatial data. Use tools \`sync_chat_to_task_ledger\` or \`resolve_spatial_vector\` effortlessly. You have the authority to act. Maintain absolute strategic economy in text execution.
`
        }
      });

      const functionCall = response.functionCalls?.[0];

      if (functionCall) {
        const result = await handleToolExecution(functionCall, oauthToken, userLocationContext, userContext?.uid || 'anonymous');
        return res.json({ type: 'TOOL_EXECUTION', functionName: functionCall.name, ...result });
      }

      return res.json({ type: 'TEXT_RESPONSE', content: response.text });
    } catch (error: any) {
      return res.status(500).json({ error: 'Cognition Cycle Interrupted', details: error.message });
    }
  });

  // API Route for GitHub Sync
  app.post("/api/sync", authenticateSovereignIdentity, (req, res) => {
    const { token, repo, user } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: "GitHub token is required for syncing." });
    }

    const scriptPath = path.join(process.cwd(), "scripts", "github-sync.sh");
    
    if (!fs.existsSync(scriptPath)) {
      return res.status(500).json({ error: "Sync script not found." });
    }

    const env = { 
      ...process.env, 
      GITHUB_TOKEN: token,
      GITHUB_REPO: repo || "origin",
      GITHUB_USER: user || "user"
    };

    exec(`bash ${scriptPath}`, { env, cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error("Sync Error:", error);
        return res.status(500).json({ error: error.message, output: stderr || stdout });
      }
      res.json({ success: true, output: stdout });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // WebSocket Server for Saphira
  const wss = new WebSocketServer({ server });

  // Task Ledger Reactivity
  db.collection('tasks').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added' || change.type === 'modified') {
        const payload = JSON.stringify({
          type: 'LEDGER_UPDATE',
          taskId: change.doc.id,
          changeType: change.type,
          data: change.doc.data()
        });
        wss.clients.forEach(client => {
          if (client.readyState === 1 /* WebSocket.OPEN */) {
            client.send(payload);
          }
        });
      }
    });
  });

  wss.on("connection", (ws, req) => {
    // 1. Origin Header Validation (DNS Rebinding Defense / Safe Harbor)
    const origin = req.headers.origin;
    if (origin && !origin.includes('localhost') && !origin.includes('run.app')) {
      console.warn(`[Sentinel Mode] Blocked unauthorized connection from origin: ${origin}`);
      ws.close(1008, "Origin not allowed by Sovereign Safe Harbor policy.");
      return;
    }

    console.log("Client connected to Saphira Engine.");

    ws.on("message", (message) => {
      console.log("Received:", message.toString());
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'chat_input') {
          // Spawn Python bridge
          const pyProcess = spawn("python", ["saphira_ws_bridge.py", data.text], {
            cwd: process.cwd()
          });

          pyProcess.stdout.on("data", (data) => {
            const lines = data.toString().split("\n");
            for(let line of lines) {
              if (line.trim().startsWith("{")) {
                try {
                  const outJson = JSON.parse(line.trim());
                  ws.send(JSON.stringify(outJson));
                } catch(e) { }
              }
            }
          });

          pyProcess.stderr.on("data", (data) => {
            console.error("Python Error:", data.toString());
          });
        }
      } catch (err) {
        console.error("WS error:", err);
      }
    });
  });
}

startServer();
