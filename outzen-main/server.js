import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cartRoutes.js"; // ES module import

// Routes import
import productRouter from "./routes/productRouter.js"; // ES module import
import authRoutes from "./routes/authRoutes.js"; // ES module import
import userRoutes from "./routes/userRoutes.js"; // ES module import
import orderRoutes from "./routes/orderRoutes.js"; // ES module import
import categoryRoutes from "./routes/categoryRoutes.js"; // ES module import
import deliveryCostRoutes from "./routes/deliveryCostRoutes.js"; // ES module import
import heroImageRoutes from "./routes/heroImageRoutes.js"; // ES module import

// Load environment variables
dotenv.config();

// Express app init
const app = express();

const allowedOrigins = [
  "https://ravorin.com",
  "https://www.ravorin.com",
  "https://apii.ravorin.com",
  "http://localhost:5173",
  "http://localhost:5174",
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(express.json({ limit: '10mb' }));   // Parse JSON body with increased limit for images
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(cookieParser());   // Parse cookies
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(morgan("dev"));    // Logger
app.use(helmet({
  crossOriginOpenerPolicy: false,
}));         // Security headers

// Serve static files (for images)
app.use(express.static('public'));

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/admin/delivery-costs", deliveryCostRoutes);
app.use("/api/v1/hero-images", heroImageRoutes);
app.use("/api/v1/hero-navbar", heroImageRoutes);

// Simple root route
app.get("/", (req, res) => {
  res.send("E-commerce API is running 🚀");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
