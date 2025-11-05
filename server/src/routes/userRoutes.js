import express from "express";
import { authMiddleware, authorizeRole } from "../middleware/auth.js";
import {
  updateUserCoordinates,
  getAvailableCouriers,
} from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/update-location", authMiddleware, updateUserCoordinates);
userRouter.get(
  "/available-couriers",
  authMiddleware,
  authorizeRole("client"),
  getAvailableCouriers,
);
export default userRouter;
