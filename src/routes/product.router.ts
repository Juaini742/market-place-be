const express = require("express");
const router = express.Router();
import {
  addProduct,
  deleteProductById,
  getProductById,
  getProductByUserId,
  updateProduct,
} from "../controllers/product.controller";

router.get("/productUser/:id", getProductByUserId);
router.get("/productId/:id", getProductById);
router.post("/addProduct", addProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProductById);

module.exports = router;
