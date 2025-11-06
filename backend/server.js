import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();
connectDB();

const app = express();
// Security + CORS
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local vite
      "http://127.0.0.1:5173",
      "https://splitease.vercel.app", // your deployed frontend
      ...(process.env.CORS_ORIGIN?.split(",") || []),
    ],
    credentials: true,
  })
);

// Parsers
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.params);
  mongoSanitize.sanitize(req.cookies);
  next();
});


// Logging
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// Routes
app.get("/", (_req, res) => res.json({ status: "ok", app: "SplitEase API" }));
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
