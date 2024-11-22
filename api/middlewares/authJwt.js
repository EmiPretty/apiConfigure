const jwt = require("jsonwebtoken");
const config = require("../config/key.js");
const User = require("../models/user.js");

const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.SECRET_KEY || config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    req.user = user;
    req.userId = decoded.id;
    next();
  });
};

const isExist = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(403).send({ message: "User not found" });
  }
  next();
};

const CheckUser = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(403).send({ message: "admin pas trouvé" });
  }
  if (!user.isadmin) {
    return res.status(403).send({ message: "pas admin" });
  }
  next();
};

const authJwt = {
  verifyToken,
  isExist,
  CheckUser,
};

module.exports = authJwt;
