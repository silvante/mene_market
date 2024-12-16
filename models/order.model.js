const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  client_name: {
    type: String,
    maxlength: 255,
    required: true,
  },
  client_mobile: {
    type: String,
    maxlength: 255,
    required: true,
  },
  client_address: {
    type: String,
    maxlength: 255,
    required: true,
  },
  oqim_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "oqim",
  },
  order_code: {
    type: Number,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  status: {
    type: String,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
