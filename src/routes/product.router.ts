const express = require("express");
const router = express.Router();
import {
  addProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  getProductByUserId,
  updateProduct,
} from "../controllers/product.controller";

router.get("/products", getAllProducts);
router.get("/productUser/:id", getProductByUserId);
router.get("/productId/:id", getProductById);
router.post("/product", addProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProductById);

module.exports = router;
