const userModel = require("./user-model");
const { mailer } = require("../../services/mailer");
const { hashPassword, comparePassword } = require("../../utils/bcrypt");
const { signJwt, generateRandomToken } = require("../../utils/token");

//user
const register = async (payload) => {
  delete payload.roles;
  payload.password = hashPassword(payload.password);
  const user = await userModel.create(payload);
  if (!user) throw new Error("Registeration Failed");
  // const result = await mailer(
  //   user.email,
  //   "User SignUp",
  //   "User SignUp sucessfull :)"
  // );
  // if (result) 
  return "Regestration Completed";
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

const create = async (payload) => {
  return userModel.create(payload);
};

const getAll = async (search, page = 1, limit = 20) => {
  const query = [];
  //search by name phone and email
  if (search?.name) {
    query.push({
      $match: {
        name: new RegExp(search?.name, "gi"),
      },
    });
  }
  if (search?.email) {
    query.push({
      $match: {
        email: new RegExp(search?.email, "gi"),
      },
    });
  }
  if (search?.phone) {
    query.push({
      $match: {
        phone: new RegExp(search?.phone, "gi"),
      },
    });
  }
  //sorting
  // if (sortBy === "createdAt") {
  //   query.push({
  //     $sort: {
  //       createdAt: sortStatus === "asc" ? -1 : 1,
  //     },
  //   });
  // }
  //default query
  query.push(
    {
      $facet: {
        metaData: [
          {
            $count: "total",
          },
        ],
        data: [
          {
            $skip: (+page - 1) * +limit,
          },
          { $limit: +limit },
        ],
      },
    },
    {
      $addFields: {
        total: {
          $arrayElemAt: ["$metaData.total", 0],
        },
      },
    },
    {
      $project: {
        metaData: 0,
      },
    }
  );
  //search,sort and filter
  const result = await userModel.aggregate(query);
  return {
    data: result[0].data,
    total: result[0].total || 0,
    page: +page,
    limit: +limit,
  };
};

const getById = async (_id) => {
  return userModel.findOne({ _id });
};

const getProfile = async (_id) => {
  return userModel.findOne({ _id });
};

const updateProfile = async (_id, payload) => {
  delete payload.email;
  return userModel.updateOne({ _id }, payload);
};

const updateById = async (_id, payload) => {
  delete payload.email;
  return userModel.updateOne({ _id }, payload);
};

const blockUser = (_id) => {
  const user = userModel.findOne({ _id });
  if (!user) throw new Error("User doesn't exist");
  // const payload = { isActive: !user.isActive };
  return userModel.updateOne({ _id }, { isActive: !user.isActive });
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
  getProfile,
  updateProfile,
  getById,
  updateById,
  fpToken,
  verifyFpToken,
  resetPassword,
  changePassword,
  blockUser,
};
