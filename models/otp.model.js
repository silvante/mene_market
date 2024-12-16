const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
  userid: mongoose.Schema.Types.ObjectId,
  otp: String,
  createdAt: Date,
  expiresAT: Date,
});

const Otp = mongoose.model("otp", otpSchema);
module.exports = Otp;
