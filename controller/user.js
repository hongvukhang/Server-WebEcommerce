const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { validationResult, Result } = require("express-validator");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

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

exports.confirmMail = (req, res) => {
  const email = req.body.email;
  const userData = req.body.user;
  User.findOne({ email: email })
    .populate("cart.items.prodId")
    .then((user) => {
      const cart = user.cart.items;

      let total = 0;

      cart.forEach((item) => {
        total += item.prodId.price * item.quantity;
      });

      transporter.sendMail({
        to: userData.email,
        from: "shop@node-complete.com",
        subject: "Confirm transaction",
        amp: `
        <!doctype html>
        <html ⚡4email data-css-strict>
        <head>
            <meta charset="utf-8">
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <style amp4email-boilerplate>
                body {
                    visibility: hidden
                }
            </style>
            <style amp-custom>
                h1 {
                    margin: 1rem;
                }
                table{
                    text-align: center;
                }
                th, td {
                border:1px solid black;
                }
            </style>
        </head>
        <body>
            <h1>Xin Chào ${userData.fullName}</h1>
            <p>Phone: ${userData.phone}</p>
            <p>Address: ${userData.address}</p>

            <table style="width:100%">
                <tr>
                    <td>Tên sản phẩm</td>
                    <td>Hình ảnh</td>
                    <td>Giá</td>
                    <td>Số lượng</td>
                    <td>Thành tiền</td>

                </tr>
                ${cart.forEach((item) => {
                  return `<tr>
                      <td>${item.prodId.name}</td>
                      <td>
                        <amp-img
                          src=${item.prodId.img1}
                          alt="photo description"
                          width="100"
                          height="100"
                        ></amp-img>
                      </td>
                      <td>${item.prodId.price}</td>
                      <td>${item.quantity}</td>
                      <td>${item.prodId.price * item.quantity}</td>
                    </tr>`;
                })}
            </table>
            <h1>Tổng thanh toán: </h1>
            <h1>${total} </h1>
            <h1>Cảm ơn bạn!</h1>
        </body>
        </html>

      `,
      });
    })
    .catch((err) => {
      res.send(err);
    });
};
