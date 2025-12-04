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
  getMapTasks,
  repostTask,
  requestTaskToCourier,
  declineTask,
  getMyRequestedTasks,
  removeCancelledTask,
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
  "/my-requested",
  authMiddleware,
  authorizeRole("courier"),
  getMyRequestedTasks,
);
taskRouter.get(
  "/availableTasks",
  authMiddleware,
  authorizeRole("courier"),
  getAvailableTasks,
);
taskRouter.get(
  "/mapTasks",
  authMiddleware,
  authorizeRole("courier"),
  getMapTasks,
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
  "/:taskId/decline",
  authMiddleware,
  authorizeRole("courier"),
  declineTask,
);
taskRouter.put(
  "/:taskId/repost",
  authMiddleware,
  authorizeRole("client"),
  repostTask,
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
taskRouter.delete(
  "/:taskId/remove",
  authMiddleware,
  authorizeRole("client"),
  removeCancelledTask,
);

export default taskRouter;
