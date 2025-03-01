const mongoose = require("mongoose");

const KeeperSchema = mongoose.Schema({
  bot_token: {
    type: String,
    required: true,
  },
});

const TokenKeeper = mongoose.model("keeper", KeeperSchema);
module.exports = TokenKeeper;
