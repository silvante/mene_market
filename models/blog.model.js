const mongoose = require("mongoose");

const blogShema = mongoose.Schema({
  banner: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    maxlength: 255,
    required: true,
  },
  desc: {
    type: String,
    maxlength: 1040,
    required: true,
  },
  link_to: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model("blog", blogShema);
module.exports = Blog;
