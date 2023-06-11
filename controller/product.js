const Product = require("../models/product");
const mongoose = require("mongoose");
exports.getProducts = (req, res, next) => {
  const proId = req.params.proId === "all" ? {} : { _id: req.params.proId };
  Product.find(proId)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductByCategory = (req, res, next) => {
  const category = req.params.category;
  const idQuery = req.query.id;

  Product.find({ category: category })
    .then((product) => {
      const result = product.filter((prod) => prod._id.toString() !== idQuery);
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
