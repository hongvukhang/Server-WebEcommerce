const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { validationResult, Result } = require("express-validator");
const User = require("../models/user");

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
    expires: Date.now() + 1000 * 60 * 60,
  });
  return url;
};

exports.uploadImage = async (req, res) => {
  console.log(req);
  console.log(req.body.name);
  // req.files.forEach((file) => {
  //   upload(file).then((result) => {
  //     link.push(result);
  //   });
  // });
};