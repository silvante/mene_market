const mongoose = require("mongoose");
const { type } = require("os");

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
    type: Number,
    max: [14, "address id can be maximum 14"],
    min: [1, "address id can be minimum 1"],
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
  courier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  status: {
    type: String,
    default: "pending",
    enum: [
      "pending",
      "checking",
      "checked",
      "sent",
      "canceled",
      "success",
      "returned",
    ],
  },
  total_price: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  operator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  desc: {
    type: String,
  },
  full_address: {
    type: String,
    maxlength: 1040,
  },
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
