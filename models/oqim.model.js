const mongoose = require("mongoose");

const oqimSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  name: {
    type: String,
    required: true,
  },
  created_at: {
    type: Data,
    default: Date.now,
  }
});

const Oqim = mongoose.model("oqim", oqimSchema);
module.exports = Oqim;
