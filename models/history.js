const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const historySchema = new Schema({
  email: { type: String, required: true, ref: "User" },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  total: { type: String, required: true },
  delivery: { type: String, required: true },
  status: { type: String, required: true },
  product: [
    {
      id: { type: String, required: true },
      img: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("History", historySchema);
