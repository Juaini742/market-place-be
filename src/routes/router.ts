import express from "express";
const router = express.Router();
import {authMiddleware} from "../middleware/auth.middleware";

const fileRouter = require("./file.router");
router.use("/", fileRouter);
const userRouter = require("./user.router");
const productRouter = require("./product.router");
const cartRouter = require("./cart.router");
const addressRouter = require("./address.router");
const checkoutRoutes = require("./chekout.router");

// public
router.use("/", userRouter);

// secured
router.use([authMiddleware]);
router.use("/secured", productRouter);
router.use("/secured", cartRouter);
router.use("/secured", addressRouter);
router.use("/secured", checkoutRoutes);

export default router;
