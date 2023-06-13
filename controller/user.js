const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult, Result } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
exports.postRegister = async (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  const confirmPassword = req.body.password;
  const phone = req.body.phone;
  const fullName = req.body.fullName;

  const auth = { cookie_token: "", date: "" };

  const errors = validationResult(req).errors;
  if (errors.length) {
    const errorData = errors.map((err) => ({ path: err.path, msg: err.msg }));
    return res.status(203).send(errorData);
  }
  const user = new User({
    fullName,
    email,
    auth,
    password,
    confirmPassword,
    phone,
  });
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
  User.findOne({ email: email })
    .then((user) => {
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword)
        return res
          .status(203)
          .send([{ path: "password", msg: "Password is wrong!" }]);
      const uuid = uuidv4();
      user.auth = { cookie_token: uuid, date: new Date() };
      return user;
    })
    .then((result) => {
      result.save().then(() => {
        return res.status(202).send({
          msg: "Login is Success",
          token: result.auth.cookie_token,
          userName: result.fullName,
        });
      });
    })

    .catch((err) =>
      res.status(203).send([{ path: email, msg: "login is faild!" }])
    );
};

exports.addToCart = (req, res, next) => {
  const id = req.body.prodId;
  const email = req.body.email;
  const quantity = req.body.quantity;

  User.findOne({ email: email })
    .then((user) => {
      const cartUser = [...user.cart.items];
      const prodIndex = cartUser.findIndex(
        (prod) => prod.prodId.toString() === id.toString()
      );
      if (prodIndex === -1) {
        cartUser.push({ prodId: id, quantity: quantity });
        user.cart = { items: cartUser };
        return user;
      }
      cartUser[prodIndex].quantity += quantity;
      user.cart = { items: cartUser };
      return user;
    })
    .then((result) => {
      result
        .save()
        .then(() => res.status(201).send("Add to cart successfully!"));
    })
    .catch((err) => {
      console.log(err);
    });
};
