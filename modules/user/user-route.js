const multer = require("multer");
const router = require("express").Router();

const userController = require("./user-controller");
const { checkRole } = require("../../utils/session-manager");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/users");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({ storage: storage });

router.post(
  "/register",
  upload.single("profilePic"),
  async (req, res, next) => {
    try {
      const file = req.file;
      if (!file) throw new Error("Please upload a file");
      req.body.profilePic = file.path.replace("public", "").replace(/\\/g, "/");
      const result = await userController.register(req.body);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }
);

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

router.get("/", checkRole(["admin", "user"]), async (req, res, next) => {
  try {
    const { name, phone, email, page, limit } = req.query;
    const search = { name, phone, email };
    const result = await userController.getAll(search, page, limit);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/", checkRole(["admin"]), async (req, res, next) => {
  try {
    const result = await userController.create(req.body);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.get("/get-profile", checkRole(["user"]), async (req, res, next) => {
  try {
    const result = await userController.getProfile(req.currentUser);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.put("/update-profile", checkRole(["user"]), async (req, res, next) => {
  try {
    const result = await userController.updateProfile(
      req.currentUser,
      req.body
    );
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", checkRole(["admin"]), async (req, res, next) => {
  try {
    console.log(req.currentUser);
    const result = await userController.getById(req.params.id);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", checkRole(["admin"]), async (req, res, next) => {
  try {
    const result = await userController.updateById(req.params.id, req.body);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
