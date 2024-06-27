const router = require("express").Router();

router.get("/", (req, res, next) => {
  try {
    res.json({ msg: "Hello from blog route" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
