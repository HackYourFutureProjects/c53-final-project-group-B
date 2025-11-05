import express from "express";
import { createRating } from "../controllers/ratingController";
import { authMiddleware, authorizeRole } from "../middleware/auth.js";
const ratingRouter = express.Router();
ratingRouter.post(
  "/:taskId",
  authMiddleware,
  authorizeRole("client"),
  createRating,
);
export default ratingRouter;
