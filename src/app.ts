import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import authRoutes from "./routes/auth";
import partsRoutes from "./routes/parts";
import { errorHandler } from "./middlewares/error";
import { logger } from "./utils/logger";

const app = express();

// Security & Logging
app.use(helmet());
app.use(pinoHttp({ logger }));
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests",
});
app.use("/api/", limiter);

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/parts", partsRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error Handling
app.use(errorHandler);

export default app;
