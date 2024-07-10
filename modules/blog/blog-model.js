const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const blogModel = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["Published", "Draft"],
    default: "Draft",
    required: true,
  },
  pages: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

module.exports = new model("Blog", blogModel);
