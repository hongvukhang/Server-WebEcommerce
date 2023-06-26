const express = require("express");

const router = express.Router();
const authController = require("../controller/auth");
const productController = require("../controller/product");
const adminController = require("../controller/admin");
router.get("/products/:proId", productController.getProducts);

router.get("/prodCate/:category", productController.getProductByCategory);

router.post(
  "/updated-product",
  authController.authAdmin,
  adminController.updateProduct
);

router.delete(
  "/delete-product",
  authController.authAdmin,
  adminController.deleteProduct
);
module.exports = router;
