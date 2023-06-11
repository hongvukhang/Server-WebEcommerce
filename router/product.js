const express = require("express");

const router = express.Router();
const productController = require("../controller/product");

router.get("/products/:proId", productController.getProducts);

router.get("/prodCate/:category", productController.getProductByCategory);

module.exports = router;
