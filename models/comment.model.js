const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  comment: {
    required: true,
    type: String,
  },
  commentor: {
    required: true,
    type: String,
  },
  rating: {
    type: Number,
    minlength: 1,
    maxlength: 5,
  },
  gender: {
    type: String,
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;
