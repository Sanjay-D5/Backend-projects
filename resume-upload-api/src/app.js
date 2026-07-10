import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import resumeRoutes from "./routes/upload.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import healthRouter from "./routes/health.routes.js";
import rateLimit from "express-rate-limit";




const app = express();

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(apiLimiter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/upload", resumeRoutes);
app.use("/api/v1/health", healthRouter);

// Root Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Resume Upload API is running 🚀",
        health: "/api/v1/health",
    });
});

app.use(errorHandler);

export default app;