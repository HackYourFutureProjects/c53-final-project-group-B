import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/authController.js";

import {
  requestResetPassword,
  resetPassword,
  changePassword,
} from "../controllers/resetPasswordController.js";
const authRouter = express.Router();
authRouter.post("/request-reset-password", requestResetPassword);
authRouter.post("/reset-password/:userId/:token", resetPassword);
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", authMiddleware, logout);
authRouter.put("/change-password", authMiddleware, changePassword);
export default authRouter;
