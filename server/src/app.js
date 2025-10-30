import express from "express";

import userRouter from "./routes/user.js";
import authRouter from "./routes/authRoutes.js";
import verifyRouter from "./routes/verifyRoutes.js";

// Create an express server
const app = express();

// Tell express to use the json middleware
app.use(express.json());

/****** Attach routes ******/
/**
 * We use /api/ at the start of every route!
 * As we also host our client code on heroku we want to separate the API endpoints.
 */
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/verify", verifyRouter);

export default app;
