const { verifyJwt } = require("./token");

const checkRole = (sysRole) => {
  return (req, res, next) => {
    const { access_token } = req.headers || "";
    if (!access_token) throw new Error("Access token is required");
    verifyJwt(access_token);
    next();
  };
};

module.exports = { checkRole };
