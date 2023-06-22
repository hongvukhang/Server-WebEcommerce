const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const User = require("../models/user");
const authController = require("../controller/auth");
const adminController = require("../controller/admin");
const roomController = require("../controller/room");
const userController = require("../controller/user");

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/register",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      }),
    body("fullName", "Full name is empty").isLength({ min: 1, max: 20 }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 6 characters."
    ).isLength({ min: 6 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
    body("phone", "Phone is empty").isLength({ min: 9, max: 10 }),
  ],
  userController.postRegister
);
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject("E-Mail is wrong!");
          }
        });
      }),
  ],
  userController.postLogin
);

router.post(
  "/loginAdmin",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject("E-Mail is wrong!");
          }
        });
      }),
  ],
  adminController.postLoginAdmin
);

router.post("/addToCart", authController.auth, userController.addToCart);

router.all("/getCart", authController.auth, userController.getCart);

router.all("/updateCart", authController.auth, userController.updateCart);

router.post("/user", authController.authAdmin, adminController.getAllUser);

router.post(
  "/sendMailConfirm",
  authController.auth,
  userController.confirmMail
);

router.post("/upload", upload.any("file"), adminController.uploadImage);

router.post("/room-chat", roomController.createChat);
router.post(
  "/getAdminChat",
  authController.authAdmin,
  roomController.getAdminChat
);
router.post("/getChats", authController.authAdmin, roomController.getChats);

router.post("/getChatUser", authController.auth, roomController.getChats);
module.exports = router;
