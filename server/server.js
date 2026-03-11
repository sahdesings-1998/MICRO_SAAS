import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import { allowRoles } from "./middleware/roleMiddleware.js";
import {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription
} from "./controllers/subscriptionController.js";

dotenv.config();
connectDB();

const app = express();

// CORS Configuration - Production-safe
const getCORSOptions = () => {
  const allowedOrigins = [
    "http://localhost:3000",           // Local development
    "http://localhost:5173",           // Vite development
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://micro-saaas.onrender.com",
    "https://micro-saas-kohl.vercel.app"
  ];

  // Production: Add Vercel frontend URL from environment variable
  if (process.env.FRONTEND_URL) {
    const urls = process.env.FRONTEND_URL.split(",").map(url => url.trim());
    allowedOrigins.push(...urls);
  }

  // Additional production domains (if needed)
  if (process.env.ALLOWED_ORIGINS) {
    const origins = process.env.ALLOWED_ORIGINS.split(",").map(url => url.trim());
    allowedOrigins.push(...origins);
  }

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl requests, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Log unauthorized origins in production for debugging
        if (process.env.NODE_ENV === "production") {
          console.warn(`Unauthorized CORS origin: ${origin}`);
        }
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,                  // Allow credentials (cookies, auth headers)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200          // For legacy browsers
  };
};

// Apply CORS middleware
app.use(cors(getCORSOptions()));

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "API running",
    status: "healthy",
    environment: process.env.NODE_ENV || "development"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/admin", adminRoutes);

// Subscription routes - explicit paths ensure POST /api/subscription works
app.post("/api/subscription", protect, allowRoles("admin"), createSubscription);
app.get("/api/subscription", protect, allowRoles("admin"), getSubscriptions);
app.put("/api/subscription/:id", protect, allowRoles("admin"), updateSubscription);
app.delete("/api/subscription/:id", protect, allowRoles("admin"), deleteSubscription);
app.use("/api/member", memberRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  // CORS error
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS error: Origin not allowed",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }

  // Generic error response
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔐 CORS enabled for: ${process.env.FRONTEND_URL || "localhost"}`);
});
