const userModel = require("./user-model");
const { mailer } = require("../../services/mailer");
const { hashPassword, comparePassword } = require("../../utils/bcrypt");

//user
const register = async (payload) => {
  payload.password = hashPassword(payload.password);
  const user = await userModel.create(payload);
  if (!user) throw new Error("Registeration Failed");
  const result = await mailer(user.email);
  if (result) return "Regestration Completed";
};

const login = async (payload) => {
  const { email, password } = payload;
  if (!email || !password) throw new Error("email or password missing");
  //check if user exist or not
  const user = await userModel
    .findOne({ email, isActive: true })
    .select("+password");
  if (!user) throw new Error("User doesn't exist");
  //if exists , get hash password
  const { password: hashPw } = user; //reassigning immediately
  //compare the password
  const result = comparePassword(password, hashPw);
  //if password match, login into the system(Access_token)
  if (!result)
    throw new Error("Email or Password mismatched. Please try again!");
  return result;
  //access token
};

const getById = (_id) => {
  return userModel.findOne({ _id });
};

const updateById = (_id, payload) => {
  return userModel.updateOne({ _id }, payload);
};

const forgotPassword = (payload) => {};

//admin
const resetPassword = (userId, payload) => {};
const changePassword = (userId, payload) => {};

module.exports = {
  register,
  login,
  getById,
  updateById,
  forgotPassword,
  resetPassword,
  changePassword,
};
