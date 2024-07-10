const slugify = require("slugify");

const slugGenerator = (title) => {
  return slugify(title, {
    lower: true,
  });
};

module.exports = { slugGenerator };
