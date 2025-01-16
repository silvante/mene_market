const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now, // Automatically sets the current date when the document is created
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.model("category", categorySchema);
module.exports = Category;
