const mongoose = require("mongoose");

const stockSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Stock = mongoose.model("stock", stockSchema);
module.exports = Stock;
