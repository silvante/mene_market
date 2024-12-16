const mongoose = require("mongoose");
const Oqim = require("../models/oqim.model");

const userSchame = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  avatar: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  verificated: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  check: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now, // Automatically sets the current date when the document is created
  },
  balance: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "seller",
  },
});

userSchame.pre("remove", async function (next) {
  try {
    const user = this._id;

    await Oqim.deleteMany({ user_id: user });
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("user", userSchame);
module.exports = User;
