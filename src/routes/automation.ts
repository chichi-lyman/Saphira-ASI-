import express from "express";
import authMiddleware, { AuthRequest } from "../middleware/auth";
import { AutomationSystem } from "../services/automationSystem";

const router = express.Router();

router.get("/tasks", authMiddleware, (req: AuthRequest, res) => {
  const userId = req.user?.email || "anonymous_user";
  const tasks = AutomationSystem.getTasksByUser(userId);
  res.json({ tasks });
});

router.post("/tasks", authMiddleware, (req: AuthRequest, res) => {
  const userId = req.user?.email || "anonymous_user";
  const { type, schedule, data } = req.body;
  
  if (!type || !schedule) {
    return res.status(400).json({ error: "Missing type or schedule" });
  }

  const task = AutomationSystem.addTask(userId, type, schedule, data);
  res.json({ task });
});

router.delete("/tasks/:id", authMiddleware, (req: AuthRequest, res) => {
  const { id } = req.params;
  const success = AutomationSystem.removeTask(id);
  if (success) {
    res.json({ message: "Task removed" });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

export default router;
