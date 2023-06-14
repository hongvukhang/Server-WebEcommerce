const User = require("../models/user");
const Product = require("../models/product");
const bcrypt = require("bcrypt");
const { validationResult, Result } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const product = require("../models/product");
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

exports.getCart = (req, res) => {
  const email = req.body.email;
  const status = req.body.status;
  User.findOne({ email: email })
    .populate("cart.items.prodId")
    .then((user) => {
      if (status === "checkout") {
        const data = {
          fullName: user.fullName,
          email: user.email,
          phone: "0" + user.phone.toString(),
          cart: user.cart.items.map((item) => ({
            name: item.prodId.name,
            price: item.prodId.price,
            quantity: item.quantity,
          })),
        };

        res.send(data);
      } else {
        res.send(user.cart);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateCart = (req, res) => {
  const email = req.body.email;
  const data = req.body.data;
  User.findOne({ email: email })
    .then((user) => {
      const cartUser = [...user.cart.items];
      const cartFilter = cartUser.filter((item) =>
        data.some((prod) => prod._id.toString() === item._id.toString())
      );
      const cartUpdate = cartFilter.map((item) => {
        const dataUpdateItem = data.find(
          (e) => e._id.toString() === item._id.toString()
        );
        return {
          ...item,
          quantity: dataUpdateItem.quantity,
        };
      });

      user.cart = { items: cartUpdate };
      return user;
    })
    .then((result) => {
      result.save().then(() => {
        res.status(201).send("Updated Success");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
