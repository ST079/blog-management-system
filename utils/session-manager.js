const { verifyJwt } = require("./token");

const checkRole = (sysRole) => {
  return (req, res, next) => {
    const { access_token } = req.headers || "";
    if (!access_token) throw new Error("Access token is required");
    const { data } = verifyJwt(access_token);
    console.log(sysRole);
    const isValidRole = data.role.some((roles) => sysRole.includes(roles));
    if (!isValidRole) throw new Error("Permission Denied!");
    next();
  };
};

module.exports = { checkRole };
