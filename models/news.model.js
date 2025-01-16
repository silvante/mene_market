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
  created_at: {
    type: Date,
    default: Date.now
  }
});

const News = mongoose.model("news", newsShema);
module.exports = News;
