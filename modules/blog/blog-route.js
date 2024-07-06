const router = require("express").Router();
const blogController = require("./blog-controller");

router.get("/", async (req, res, next) => {
  try {
    const { title, author, page, limit } = req.query;
    const search = { title, author };
    const result = await blogController.getAll(search, page, limit);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const result = await blogController.create(req.body);
    res.json({ msg: result });
  } catch (error) {
    next(error);
  }
});

router.put("/update-blog/:id", async (req, res, next) => {
  try {
    const result = await blogController.updateById(req.params.id, req.body);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
