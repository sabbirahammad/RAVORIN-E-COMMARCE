import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    category: { type: String, required: true },
    images: [{ type: String }],
    isTrending: { type: Boolean, default: false },
    isTopProduct: { type: Boolean, default: false },
    description: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
