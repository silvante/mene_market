const mongoose = require("mongoose");

const donateSchema = mongoose.Schema({
  fund: {
    type: Number,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  anonim: {
    type: Boolean,
    default: false,
  },
  box_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "donate_box",
  },
  created_at: {
    type: Date,
    default: Date.now, // Automatically sets the current date when the document is created
  },
});

const Donate = mongoose.model("donate", donateSchema);
module.exports = Donate;
