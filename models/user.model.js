const mongoose = require("mongoose");
const Oqim = require("../models/oqim.model");

const userSchame = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    original: { type: String },
    small: { type: String },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
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
    enum: ["seller", "owner", "admin", "operator", "courier"],
    default: "seller",
  },
});

const User = mongoose.model("user", userSchame);

userSchame.pre("remove", async function (next) {
  try {
    const user = this._id;

    await Oqim.deleteMany({ user: user });
  } catch (error) {
    next(error);
  }
});

module.exports = User;
