require("dotenv").config();
const jwt = require("jsonwebtoken");

const signJwt = (payload) => {
  return jwt.sign(
    {
      data: payload,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_DURATION }
  );
};

const verifyJwt = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const generateRandomToken = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

module.exports = { signJwt, verifyJwt, generateRandomToken };
