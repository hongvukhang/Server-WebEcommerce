const express = require("express");

const router = express.Router();
const authController = require("../controller/auth");
const historyController = require("../controller/history");

router.post("/history", authController.auth, historyController.getHistory);

module.exports = router;
