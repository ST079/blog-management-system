const { Schema, modal } = require("mongoose");
const { ObjectId } = Schema.Types;

const blogModel = new Schema({
  title: { type: String, required: true },
  slut: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: ObjectId, ref: "User", required: true },
  createdAt: { type: Date, degault: Date.now() },
  updatedAt: { type: Date, degault: Date.now() },
});

module.exports = new modal("Blog", blogModel);
