import express from "express";
import authRouter from "./routes/authRoutes.js";
import verifyRouter from "./routes/verifyRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import userRouter from "./routes/userRoutes.js";
import ratingRouter from "./routes/ratingRoutes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
// Create an express server
const app = express();

// Tell express to use the json middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/****** Attach routes ******/
/**
 * We use /api/ at the start of every route!
 * As we also host our client code on heroku we want to separate the API endpoints.
 */

app.use("/api/auth", authRouter);
app.use("/api/verify", verifyRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);
app.use("/api/ratings", ratingRouter);

export default app;
