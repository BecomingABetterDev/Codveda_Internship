import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import promptRoutes from "./routes/promptRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
dotenv.config();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error(
        "[Fatal Error] Missing critical environment variables (MONGO_URI, JWT_SECRET)"
    );
    process.exit(1);
}

connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json({ limit: "10kb" })); // Prevents large payload denial-of-service attacks

// Rate Limiting for Auth Endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per IP per window
    message: {
        success: false,
        error: "Too many authentication attempts. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Route Mounting
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/prompts", promptRoutes);

app.get("/api/health", (req, res) => {
    res
        .status(200)
        .json({
            success: true,
            status: "operational",
            timestamp: new Date().toISOString(),
        });
});

// Error Handling Stack
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`[Server] Production engine online on port ${PORT}`)
);