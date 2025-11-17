import express from "express";
import { authMiddleware, authorizeRole } from "../middleware/auth.js";
import {
  acceptTask,
  createTask,
  getMyTasks,
  startTask,
  completeTask,
  cancelTask,
  getAvailableTasks,
  requestTaskToCourier,
} from "../controllers/taskController.js";
const taskRouter = express.Router();

taskRouter.post("/", authMiddleware, authorizeRole("client"), createTask);
taskRouter.post(
  "/make-request",
  authMiddleware,
  authorizeRole("client"),
  requestTaskToCourier,
);
taskRouter.get("/my-tasks", authMiddleware, getMyTasks);
taskRouter.get(
  "/availableTasks",
  authMiddleware,
  authorizeRole("courier"),
  getAvailableTasks,
);
taskRouter.put(
  "/:taskId/start",
  authMiddleware,
  authorizeRole("courier"),
  startTask,
);
taskRouter.put(
  "/:taskId/accept",
  authMiddleware,
  authorizeRole("courier"),
  acceptTask,
);

taskRouter.put(
  "/:taskId/complete",
  authMiddleware,
  authorizeRole("courier"),
  completeTask,
);
taskRouter.put(
  "/:taskId/cancel",
  authMiddleware,
  authorizeRole("client"),
  cancelTask,
);
export default taskRouter;
