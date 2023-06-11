const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { check, body } = require("express-validator");
const userController = require("../controller/user");

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
    body("password", "Password is wrong!").isLength({ min: 6 }),
  ],
  userController.postLogin
);
module.exports = router;
