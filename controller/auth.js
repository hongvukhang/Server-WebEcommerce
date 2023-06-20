const User = require("../models/user");

exports.auth = (req, res, next) => {
  const token = req.body.token;
  const email = req.body.email;

  User.findOne({ email: email })
    .then((user) => {
      if (user.auth.cookie_token.toString() === token.toString()) {
        const dateCreateCookie = new Date(user.auth.date);
        const date = new Date();
        const isOutDate = date - dateCreateCookie <= 7200000;
        if (isOutDate) {
          return next();
        }
      }
      return res.status(203).send("Need authenticity!");
    })
    .catch(() => {
      return res.status(203).send("Need authenticity!");
    });
};

exports.authAdmin = (req, res, next) => {
  const token = req.body.token;
  const email = req.body.email;

  User.findOne({ email: email })
    .then((user) => {
      if (user.role === "customer")
        return res.status(203).send("Need authenticity!");
      if (user.auth.cookie_token.toString() === token.toString()) {
        const dateCreateCookie = new Date(user.auth.date);
        const date = new Date();
        const isOutDate = date - dateCreateCookie <= 7200000;
        if (isOutDate) {
          return next();
        }
      }
      return res.status(203).send("Need authenticity!");
    })
    .catch(() => {
      return res.status(203).send("Need authenticity!");
    });
};
