const mongoose = require("mongoose");

const stockSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
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
