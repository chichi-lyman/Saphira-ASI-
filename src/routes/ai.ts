import express from "express";
import authMiddleware, { AuthRequest } from "../middleware/auth";
import { selectAgent } from "../services/agents";
import { queryClaude } from "../services/claude";
import { MemorySystem } from "../services/memorySystem";

const router = express.Router();

router.post("/ask", authMiddleware, async (req: AuthRequest, res) => {
  const { input } = req.body;
  
  // Use a mock userId if one isn't provided by auth (e.g., anonymous demo)
  const userId = req.user?.email || "anonymous_user";

  try {
    const agent = selectAgent(input);
    
    // 1. Get memory context
    const contextString = MemorySystem.getContextString(userId);
    const memory = MemorySystem.initUser(userId);
    
    const history = memory.history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      content: h.content
    }));

    // 2. Query AI with context and history
    const result = await queryClaude(input, agent, contextString, history);

    // 3. Store new interaction in memory
    MemorySystem.addHistory(userId, 'user', input);
    if (result.text) {
      MemorySystem.addHistory(userId, 'assistant', result.text);
    }

    res.json({ agent, result });
  } catch (error: any) {
    console.error("AI Route Error:", error);
    res.status(500).json({ error: error.message || "Failed to process AI request" });
  }
});

// Endpoint to update memory preferences manually if needed
router.post("/memory/preference", authMiddleware, (req: AuthRequest, res) => {
  const userId = req.user?.email || "anonymous_user";
  const { key, value } = req.body;
  
  if (key && value) {
    MemorySystem.updatePreference(userId, key, value);
    res.json({ message: "Preference updated" });
  } else {
    res.status(400).json({ error: "Missing key or value" });
  }
});

export default router;
