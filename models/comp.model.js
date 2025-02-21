const mongoose = require("mongoose");

const competitionSchema = mongoose.Schema({
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
  banner: {
    type: String,
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "product",
  },
  min_length: {
    type: Number,
    required: true,
  },
  places: {
    type: Array,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  finish_date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Comp = mongoose.model("competition", competitionSchema);
module.exports = Comp;
