const express = require("express");

const router = express.Router();
const authController = require("../controller/auth");
const historyController = require("../controller/history");

router.post("/history", authController.auth, historyController.getHistory);

router.post(
  "/historyAdmin",
  authController.authAdmin,
  historyController.getHistory
);
module.exports = router;
