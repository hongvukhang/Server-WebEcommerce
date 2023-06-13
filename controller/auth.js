exports.auth = (req, res, next) => {
  const isAuth = req.body.isLogin;
  if (isAuth === "true") {
    return next();
  }
  return res.status(203).send("Need authenticity!");
};
