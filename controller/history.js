const History = require("../models/history");

exports.getHistory = (req, res) => {
  const email = req.body.admin ? {} : { email: req.body.email };

  History.find(email)
    .then((history) => {
      res.status(200).send(history);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
