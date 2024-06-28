const { Schema, model } = require("mongoose");

const userModel = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: Number,
  roles: {
    type: [String],
    enum: ["admin", "user"],
    default: "user",
    required: true,
  },
  isActive: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, degault: Date.now() },
  updatedAt: { type: Date, degault: Date.now() },
});

module.exports = new model("User", userModel);
