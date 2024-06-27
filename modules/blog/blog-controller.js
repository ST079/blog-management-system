const blogModel = require("./blog-model");
const bookmarkModel = require("../bookmark/bookmark-model");
//  CRUD

//create
const create = (payload) => {
  return userModel.create(payload);
};

//Search
const getAll = () => {
  return userModel.find();
};
const getById = (_id) => {
  return userModel.findOne({ _id });
};

//update
const updateById = (_id, payload) => {
  return userModel.updateOne({ _id }, payload);
};

//delete
const deleteById = (_id) => {
  return userModel.deleteOne({ _id });
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
