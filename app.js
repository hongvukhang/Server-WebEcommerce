const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const productRouter = require("./router/product");
const userRouter = require("./router/user");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(cookieParser("cookie"));

app.use("/product", productRouter);
app.use(userRouter);
mongoose
  .connect(
    "mongodb+srv://khanghvfx17345:IBR9NwJ3lwdaWMhD@cluster0.5jq4ht4.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
