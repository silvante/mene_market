const axios = require("axios");
const { LoadToken } = require("./token_loader");

const escapeMarkdown = (text) => {
  return text.replace(/[*_]/g, "\\$&"); // Escape only necessary characters
};

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

    let rendered_message = `*${escapeMarkdown(title)}*\n\n${escapeMarkdown(
      message
    )}`;

    if (warning) rendered_message += `\n\n${escapeMarkdown(warning)}`;
    if (desc) rendered_message += `\n\n*izoh:*\n${escapeMarkdown(desc)}`;
    if (order_code)
      rendered_message += `\n\n*Buyurtma raqami:* ${escapeMarkdown(
        order_code
      )}`;
    if (balance)
      rendered_message += `\n\n*Hozirgi balansingiz:* ${escapeMarkdown(
        balance
      )} so'm`;

    const response = await axios.post(
      `https://api.telegram.org/bot${bot_token}/sendMessage`,
      { chat_id: chat_id, text: rendered_message, parse_mode: "Markdown" }
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
