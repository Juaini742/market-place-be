const express = require("express");
const router = express.Router();
import {
  addProduct,
  deleteProductById,
  getProductByUserId,
  updateProduct,
} from "../controllers/product.controller";

router.get("/productUser", getProductByUserId);
router.post("/addProduct", addProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProductById);

module.exports = router;
