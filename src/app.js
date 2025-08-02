import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
import userRouter from "./routes/user.routes.js";
import problemRouter from "./routes/problem.routes.js";
import submissionRouter from "./routes/submission.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/submissions", submissionRouter);

export { app };
