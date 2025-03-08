const TokenKeeper = require("./keeper/keeper.model");

let bot_token = null;

const LoadToken = async () => {
  if (bot_token) return bot_token;

  try {
    const bot_data = await TokenKeeper.findOne();

    if (!bot_data || !bot_data.bot_token) {
      throw new Error("Token is not active or missing");
    }

    bot_token = bot_data.bot_token;
    console.log("✅ Bot token loaded successfully!");
    return bot_token;
  } catch (err) {
    console.log(`❌ loading error: ${err.message}`);
    return null; // Ensure function always returns something
  }
};

module.exports = { LoadToken };
