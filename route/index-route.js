const router = require("express").Router();
const userRouter = require("../modules/user/user-route");
const blogRouter = require("../modules/blog/blog-route");

//route 1
router.get("/", (req, res, next) => {
  try {
    res.json({ msg: "hello form index route" });
  } catch (err) {
    next(err);
  }
});

router.use("/users", userRouter);
router.use("/blogs", blogRouter);

module.exports = router;
