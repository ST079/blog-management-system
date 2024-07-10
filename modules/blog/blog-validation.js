const Joi = require("joi");

const schema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().min(50).required(),
  author: Joi.string(),
  status: Joi.string()
    .valid(("Published", "Draft"))
    .default("Draft"),
});

const blogValidate = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  next();
};

module.exports = { blogValidate };
