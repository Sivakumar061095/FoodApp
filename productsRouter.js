const express = require("express");

const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProductbyId,
  deleteProductById,
} = require("./productsController");
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.patch("/:id", updateProductbyId);
router.delete("/:id", deleteProductById);
module.exports = router;
