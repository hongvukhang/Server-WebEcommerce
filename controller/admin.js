const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { validationResult, Result } = require("express-validator");
const User = require("../models/user");
const Product = require("../models/product");
const firebase = require("../firebase/firebase");

exports.postLoginAdmin = (req, res) => {
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
      if (!validPassword) {
        return res
          .status(203)
          .send([{ path: "password", msg: "Password is wrong!" }]);
      }

      if (user.role === "customer") {
        return res
          .status(203)
          .send([{ path: "", msg: "Email is not allowed to access" }]);
      }
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

exports.getAllUser = (req, res) => {
  User.find()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
    });
};

//get link url firebase storage

async function generateSignedUrl(filename) {
  const options = {
    version: "v2",
    action: "read",
    expires: Date.now() + 1000 * 60 * 60,
  };

  const [url] = await firebase.bucket.file(filename).getSignedUrl(options);
  return url;
}

const upload = async (file) => {
  const blob = firebase.bucket.file(file.originalname);
  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });
  blobWriter.on("error", (err) => {
    console.log("run");
    console.log(err);
  });
  blobWriter.on("finish", () => {});
  blobWriter.end(file.buffer);

  const [url] = await firebase.bucket.file(file.originalname).getSignedUrl({
    version: "v2",
    action: "read",
    expires: Date.now() + 1000 * 60 * 60 * 24 * 30 * 12 * 2,
  });
  return url;
};

exports.addProduct = async (req, res) => {
  const name = req.body.name;
  const category = req.body.category;
  const short_desc = req.body.short_desc;
  const long_desc = req.body.long_desc;
  const price = req.body.price;

  const link = req.files.map((file) => {
    return upload(file);
  });

  const product = await new Product({
    category: category,
    name: name,
    long_desc: long_desc,
    short_desc: short_desc,
    price: price,
    img1: await link[0],
    img2: await link[1],
    img3: await link[2],
    img4: await link[3],
    amount: 1000,
  });

  await product.save().then(() => res.status(201).send("Add product success"));
};
exports.updateProduct = (req, res) => {
  const idProduct = req.body.id;
  const name = req.body.name;
  const category = req.body.category;
  const price = req.body.price;
  const short_desc = req.body.short_desc;
  const long_desc = req.body.long_desc;

  Product.findOne({ _id: idProduct })
    .then((product) => {
      product.name = name;
      product.category = category;
      product.price = price;
      product.short_desc = short_desc;
      product.long_desc = long_desc;
      return product;
    })
    .then((result) => {
      result
        .save()
        .then(() => res.status(204).send({ msg: "Updated Product Success!" }));
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = async (req, res) => {
  const id = req.body.id;
  Product.deleteOne({ _id: id })
    .then((result) => {
      res.status(200).send({ msg: "Deleted Success" });
    })
    .catch((err) => res.send(err));
};
