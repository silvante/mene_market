const axios = require("axios");
const { LoadToken } = require("./token_loader");

const SendMessage = async (chat_id, data) => {
  try {
    const bot_token = await LoadToken();
    if (!bot_token) {
      console.log("❌ token loading error");
      return;
    }
    const {
      title = "",
      message = "",
      balance = "",
      order_code = "",
      desc = "",
      warning = "",
    } = data || {};

    let rendered_message = `*${title}*\n\n${message}`;

    if (warning) rendered_message += `\n\n${warning}`;
    if (desc) rendered_message += `\n\n*izoh:*\n${desc}`;
    if (order_code) rendered_message += `\n\n*Buyurtma raqami:* ${order_code}`;
    if (balance)
      rendered_message += `\n\n*Hozirgi balansingiz:* ${balance} so'm`;

    const response = await axios.post(
      `https://api.telegram.org/bot${bot_token}/sendMessage`,
      { chat_id: chat_id, text: rendered_message, parse_mode: "MarkdownV2" }
    );

    console.log(`✅ Telegram Response: ${response.data}`);
  } catch (err) {
    console.error(
      `❌ Telegram API Error: ${err.message}`,
      err.response?.data || err
    );
  }
};

module.exports = SendMessage;
