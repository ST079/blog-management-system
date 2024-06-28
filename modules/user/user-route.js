const router = require("express").Router();
const { json } = require("express");
const userController = require("./user-controller");
const { checkRole } = require("../../utils/session-manager");

router.get("/", checkRole("admin"), async (req, res, next) => {
  try {
    const result = await userController.getAll();
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const result = await userController.register(req.body);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await userController.login(req.body);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
