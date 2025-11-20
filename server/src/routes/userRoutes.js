import express from "express";
import { authMiddleware, authorizeRole } from "../middleware/auth.js";
import { getRequestedTasks } from "../controllers/taskController.js";
import {
  updateUserCoordinates,
  getAvailableCouriers,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/update-location", authMiddleware, updateUserCoordinates);
userRouter.get(
  "/available-couriers",
  authMiddleware,
  authorizeRole("client"),
  getAvailableCouriers,
);
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.put("/profile", authMiddleware, updateUserProfile);
userRouter.get(
  "/requested-tasks",
  authMiddleware,
  authorizeRole("courier"),
  getRequestedTasks,
);

export default userRouter;
