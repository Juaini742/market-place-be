import {
  addCart,
  deleteCart,
  getAllCart,
  getCartByUserId,
  updateCart,
} from "../controllers/cart.controller";

const express = require("express");
const router = express.Router();

router.get("/carts", getAllCart);
router.get("/cartsUser", getCartByUserId);
router.post("/cart/:id", addCart);
router.put("/updateCart/:id", updateCart);
router.delete("/deleteCart/:id", deleteCart);

module.exports = router;
