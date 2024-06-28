const userModel = require("./user-model");
const { mailer } = require("../../services/mailer");
const { hashPassword, comparePassword } = require("../../utils/bcrypt");
const { signJwt, generateRandomToken } = require("../../utils/token");

//user
const register = async (payload) => {
  payload.password = hashPassword(payload.password);
  const user = await userModel.create(payload);
  if (!user) throw new Error("Registeration Failed");
  const result = await mailer(
    user.email,
    "User SignUp",
    "User SignUp sucessfull :)"
  );
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
    throw new Error("Email or Password mismatched.Please try again!");
  //access token
  const userPayload = { name: user.name, email: user.email, role: user.roles };
  const token = await signJwt(userPayload);
  return token;
};

const create = (payload) => {
  return userModel.create(payload);
};

const getAll = () => {
  return userModel.find();
};

const getById = (_id) => {
  return userModel.findOne({ _id });
};

const updateById = (_id, payload) => {
  return userModel.updateOne({ _id }, payload);
};

//forgot password
const fpToken = async (payload) => {
  const { email } = payload;
  if (!email) throw new Error("Email is Required!!!");
  const user = await userModel.findOne({ email });
  if (!user) throw new Error("User doesn't exist");
  //generate token
  const randomToken = generateRandomToken();
  //store token in db
  await userModel.updateOne({ email }, { token: randomToken });
  const isEmailSent = await mailer(
    user.email,
    "Forget Password",
    `Your token is ${randomToken}`
  );
  if (isEmailSent) return "Forgot Password token sent successfully";
};

const verifyFpToken = async (payload) => {
  const { token, password, email } = payload;
  if (!token || !password || !email) throw new Error("Something went wrong!!");
  const user = await userModel.findOne({ email });
  if (!user) throw new Error("User not found!");
  const { token: verifyToken } = user;
  if (token != verifyToken) throw new Error("Token mismatched");
  await userModel.updateOne(
    { email },
    { password: hashPassword(password) },
    { token: "" }
  );
  return "Password Updated Successfully";
};

//admin
const resetPassword = (payload) => {
  const { userId, password } = payload;
  if (!userId || !password) throw new Error("UserId or Password is required");
  return userModel.updateOne(
    { _id: userId },
    { password: hashPassword(password) }
  );
};
const changePassword = async (payload) => {
  const { userId, oldPassword, newPassword } = payload;
  if (!userId || !oldPassword || !newPassword)
    throw new Error("Something went wrong");
  const user = await userModel.findOne({ _id: userId }).select("+password");
  if (!user) throw new Error("User not found!");
  const isValidOldPassword = comparePassword(oldPassword, user.password);
  if (!isValidOldPassword) throw new Error("Passwotd didnot match");
  await userModel.updateOne(
    { _id: userId },
    { password: hashPassword(newPassword) }
  );
  return "Password changed successfully";
};

module.exports = {
  register,
  login,
  create,
  getAll,
  getById,
  updateById,
  fpToken,
  verifyFpToken,
  resetPassword,
  changePassword,
};
