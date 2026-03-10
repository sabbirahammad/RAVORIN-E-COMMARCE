import express from "express";
import upload from "../middlewares/multer.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { getHeroImages, uploadHeroImages } from "../controllers/heroImageController.js";

const router = express.Router();

router.get("/", getHeroImages);
router.post("/upload", protect, adminOnly, upload.array("images", 3), uploadHeroImages);

export default router;

