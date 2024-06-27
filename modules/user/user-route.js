const router = require("express").Router();
const { json } = require("express");
const userController = require("./user-controller");
router.get("/", (req, res, next) => {
  try {
    res.json({ msg: "Hello from user route" });
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
