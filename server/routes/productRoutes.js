import { Router } from "express";
import Product from "../models/Product.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// Public: get products by user (exhibitor)
router.get("/user/:userId", async (req, res) => {
  const products = await Product.find({ user: req.params.userId, showcasing: true });
  res.json(products);
});

// Exhibitor: get own products
router.get("/mine", protect, requireRole("exhibitor"), async (req, res) => {
  const products = await Product.find({ user: req.user.userId }).sort({ createdAt: -1 });
  res.json(products);
});

// Exhibitor: create product
router.post("/", protect, requireRole("exhibitor"), async (req, res) => {
  const { name, category, description, image, tags, showcasing } = req.body;
  if (!name || !description)
    return res.status(400).json({ message: "Name and description are required" });

  const product = await Product.create({
    user: req.user.userId,
    name, category: category || "Other", description,
    image: image || "", tags: tags || [], showcasing: showcasing !== false,
  });
  res.status(201).json(product);
});

// Exhibitor: update product
router.put("/:id", protect, requireRole("exhibitor"), async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, user: req.user.userId });
  if (!product) return res.status(404).json({ message: "Product not found" });

  const fields = ["name", "category", "description", "image", "tags", "showcasing"];
  fields.forEach(f => { if (req.body[f] !== undefined) product[f] = req.body[f]; });

  await product.save();
  res.json(product);
});

// Exhibitor: delete product
router.delete("/:id", protect, requireRole("exhibitor"), async (req, res) => {
  await Product.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
  res.json({ message: "Product deleted" });
});

export default router;
