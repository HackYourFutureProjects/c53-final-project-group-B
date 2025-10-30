import express from "express";
import { register, login } from "../controllers/authController.js";
import {
  requestResetPassword,
  resetPassword,
} from "../controllers/resetPasswordController.js";
const authRouter = express.Router();
authRouter.post("/request-reset-password", requestResetPassword);
authRouter.post("/reset-password/:userId/:token", resetPassword);
authRouter.post("/register", register);
authRouter.post("/login", login);
export default authRouter;
