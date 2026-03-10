import express from "express";
import { register, login, getProfile, googleAuth } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);

// Protected routes
router.get("/profile", protect, getProfile);
router.get("/check-profile", protect, getProfile);

export default router;
