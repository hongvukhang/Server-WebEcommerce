const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const productRouter = require("./router/product");
const userRouter = require("./router/user");
const historyRouter = require("./router/history");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(cookieParser("cookie"));

app.use("/product", productRouter);
app.use(userRouter);
app.use(historyRouter);
mongoose
  .connect(
    "mongodb+srv://khanghvfx17345:IBR9NwJ3lwdaWMhD@cluster0.5jq4ht4.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then((result) => {
    const server = app.listen(5000);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
