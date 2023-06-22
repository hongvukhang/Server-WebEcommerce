const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  emailUSer: { type: String, required: true },
  dateSend: { type: String, required: true },
  msg: [
    {
      message: {
        type: String,
        required: true,
      },
      sender: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
