const router = require("express").Router();
const userController = require("./user-controller");
const { checkRole } = require("../../utils/session-manager");

router.post("/", checkRole("admin"), async (req, res, next) => {
  try {
    const result = await userController.create(req.body);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/register", checkRole(["admin"]), async (req, res, next) => {
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

router.post("/generate-fp-token", async (req, res, next) => {
  try {
    const result = await userController.fpToken(req.body);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/verify-fp-token", async (req, res, next) => {
  try {
    const result = await userController.verifyFpToken(req.body);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", checkRole(["admin"]), async (req, res, next) => {
  try {
    const result = await userController.resetPassword(req.body);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/change-password",
  checkRole(["admin", "user"]),
  async (req, res, next) => {
    try {
      const result = await userController.changePassword(req.body);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/reset-password", checkRole(["admin"]), async (req, res, next) => {
  try {
    const result = await userController.resetPassword(req.body);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.get("/", checkRole(["admin", "user"]), async (req, res, next) => {
  try {
    const result = await userController.getAll();
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
