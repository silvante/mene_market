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
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model("blog", blogShema);
module.exports = Blog;
