import mongoose from "mongoose";

const heroImageSchema = new mongoose.Schema(
  {
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length <= 3,
        message: "Maximum 3 hero images are allowed",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("HeroImage", heroImageSchema);

