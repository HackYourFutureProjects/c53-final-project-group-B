import express from "express";
import {
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/verificationController.js";
const verifyRouter = express.Router();
verifyRouter.get("/verify-email/:userId/:token", verifyEmail);
verifyRouter.post("/resend-verification-email", resendVerificationEmail);

export default verifyRouter;
