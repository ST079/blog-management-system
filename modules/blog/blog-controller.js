const blogModel = require("./blog-model");
const bookmarkModel = require("../bookmark/bookmark-model");
//  CRUD

//create
const create = (payload) => {
  return blogModel.create(payload);
};

//Search
const getAll = () => {
  return blogModel.find();
};
const getById = (_id) => {
  return blogModel.findOne({ _id });
};

//update
const updateById = (_id, payload) => {
  return blogModel.updateOne({ _id }, payload);
};

//delete
const deleteById = (_id) => {
  return blogModel.deleteOne({ _id });
};

const bookMark = (payload) => {
  const { blogs, user } = payload;
  if (!blogs.length > 0 || !user) throw new Error("Blogs and user missing");
  bookmarkModel.create(payload);
};

const authorBlog = () => {};
module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
  bookMark,
  authorBlog,
};
