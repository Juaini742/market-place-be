import express from "express";
const router = express.Router();
import {authMiddleware} from "../middleware/auth.middleware";
import {
  getAllProducts,
  getProductById,
} from "../controllers/product.controller";
const fileRouter = require("./file.router");
router.use("/", fileRouter);
const userRouter = require("./user.router");
const productRouter = require("./product.router");
const cartRouter = require("./cart.router");
const addressRouter = require("./address.router");
const checkoutRoutes = require("./chekout.router");
const commentRoutes = require("./comment.router");

// public
router.use("/", userRouter);
router.get("/public/products", getAllProducts);
router.get("/public/productId/:id", getProductById);

// secured
router.use([authMiddleware]);
router.use("/secured", productRouter);
router.use("/secured", cartRouter);
router.use("/secured", addressRouter);
router.use("/secured", checkoutRoutes);
router.use("/secured", commentRoutes);

export default router;
