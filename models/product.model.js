const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 255,
  },
  desc: {
    type: String,
    required: true,
    maxlength: 1040,
  },
  images: [
    {
      large: { required: true, type: String },
      medium: { required: true, type: String },
      small: { required: true, type: String },
    }
  ],
  tags: [String],
  price: {
    required: true,
    type: Number,
  },
  for_seller: {
    required: true,
    type: Number,
  },
  total: {
    required: true,
    type: Number,
  },
  sold: Number,
  created_at: {
    type: Date,
    default: Date.now, // Automatically sets the current date when the document is created
  },
  type: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
