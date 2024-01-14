import {
  addCart,
  deleteCart,
  getAllCart,
  getCartByUserId,
} from "../controllers/cart.controller";

const express = require("express");
const router = express.Router();

router.get("/carts", getAllCart);
router.get("/cartsUser/:id", getCartByUserId);
router.post("/cart/:id", addCart);
router.delete("/deleteCart/:id", deleteCart);

module.exports = router;
