const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  auth: {
    cookie_token: { type: String, required: false },
    date: { type: String, required: false },
  },
  phone: { type: String, required: true },
  cart: {
    items: [
      {
        prodId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
