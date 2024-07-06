const { verifyJwt } = require("./token");
const userModel = require("../modules/user/user-model");

const checkRole = (sysRole) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.access_token || "";
      if (!token) throw new Error("Access token is required");
      const data = verifyJwt(token);
      if (!data) throw new Error("Permission Denied");
      //check Role
      const { data: user } = data;
      const { email } = user;
      const userData = await userModel.findOne({ email, isActive: true });
      const isValidRole = sysRole.some((role) => userData.roles.includes(role));
      if (!isValidRole) throw new Error("Permission Denied!");
      req.currentUser = userData._id;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { checkRole };
