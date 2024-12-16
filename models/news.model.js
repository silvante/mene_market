const mongoose = require("mongoose");

const newsShema = mongoose.Schema({
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

const News = mongoose.model("news", newsShema);
module.exports = News;
