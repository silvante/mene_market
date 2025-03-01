const axios = require("axios");
const { LoadToken } = require("./token_loader");

const SendMessage = async (chat_id, message) => {
  try {
    const bot_token = await LoadToken();
    if (!bot_token) console.log("❌ token loading error");

    let rendered_message = `
    menemarket sayti tomonidan:

    habar: ${message}

    sahifa: menemarket.uz ✅
    `;

    const response = await axios.post(
      `https://api.telegram.org/bot${bot_token}/sendMessage`,
      { chat_id: chat_id, text: rendered_message }
    );

    console.log(`✅ Telegram Response: ${response.data}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

module.exports = SendMessage;
