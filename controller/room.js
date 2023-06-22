const io = require("../socket");
const Room = require("../models/room");

exports.createChat = async (req, res, next) => {
  const msg = req.body.msg;
  const sender = req.body.sender;
  const email = req.body.email;

  try {
    const isRoom = await Room.findOne({ emailUSer: email });
    if (!isRoom) {
      const room = new Room({
        emailUSer: email,
        dateSend: new Date(),
        msg: [
          {
            message: msg,
            sender: sender,
          },
        ],
      });
      await room.save();
      io.getIO().emit("msg", {
        action: "Created",
        msg: { email: email, _id: Math.random() },
      });
    } else {
      isRoom.dateSend = new Date();
      isRoom.msg.push({ message: msg, sender: sender });
      await isRoom.save();
      io.getIO().emit("msg", {
        action: "updated",
        msg: { email: email, msg: msg, sender: sender, _id: isRoom._id },
      });
    }
    res.status(201).send({
      message: "created successfully!",
    });
  } catch (error) {
    res.send(error);
  }
};

exports.getAdminChat = (req, res) => {
  Room.find()
    .then((room) => {
      // res.send(room);
      const resultRoom = room.map((result) => ({
        _id: result._id,
        emailUser: result.emailUSer,
      }));
      res.status(202).send(resultRoom);
    })
    .catch((err) => console.log(err));
};

exports.getChats = (req, res, next) => {
  const email = { emailUSer: req.body.emailChat };

  Room.find(email)
    .then((room) => {
      res.status(200).send(room);
    })
    .catch((err) => console.log(err));
};
