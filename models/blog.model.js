const mongoose = require("mongoose");

const blogShema = mongoose.Schema({
  banner: {
    large: { required: true, type: String },
    medium: { required: true, type: String },
    small: { required: true, type: String },
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
