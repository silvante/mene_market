const mongoose = require("mongoose");

const KeeperSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

const TokenKeeper = mongoose.model("keeper", KeeperSchema);
module.exports = TokenKeeper;
