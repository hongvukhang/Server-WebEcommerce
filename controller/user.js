const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult, Result } = require("express-validator");

exports.postRegister = async (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  const confirmPassword = req.body.password;
  const phone = req.body.phone;
  const fullName = req.body.fullName;
  const errors = validationResult(req).errors;
  if (errors.length) {
    const errorData = errors.map((err) => ({ path: err.path, msg: err.msg }));
    return res.status(203).send(errorData);
  }
  const user = new User({ fullName, email, password, confirmPassword, phone });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user
    .save()
    .then(() => res.status(201).send("success"))
    .catch((err) => res.send(err));
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req).errors;

  if (errors.length) {
    const errorData = errors.map((err) => ({ path: err.path, msg: err.msg }));
    return res.status(203).send(errorData);
  }
};
