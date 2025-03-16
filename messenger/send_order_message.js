const axios = require("axios");
// const { LoadToken } = require("./token_loader");

const escapeMarkdown = (text) => {
  return text; // Escape only necessary characters
};

const SendOrderMessage = async (data) => {
  try {
    // const bot_token = await LoadToken();
    // if (!bot_token) {
    //   console.log("❌ token loading error");
    //   return;
    // }
    const {
      title = "",
      name = "",
      address = "",
      order_code = "",
      phone_number = "",
      time = "",
      order_id = "",
    } = data || {};

    let rendered_message = `*${escapeMarkdown(
      title
    )}*\n\n*👤 Foydalanuvchi:*${escapeMarkdown(name)}`;

    if (warning) rendered_message += `\n*📍 Manzil:*${escapeMarkdown(address)}`;
    if (desc)
      rendered_message += `\n*📞 Tel raqam:*\n${escapeMarkdown(phone_number)}`;
    if (order_id) rendered_message += `\n*🆔 ID:* ${escapeMarkdown(order_id)}`;
    if (order_code)
      rendered_message += `\n*📎 Raqam:* ${escapeMarkdown(order_code)}`;
    if (balance) rendered_message += `\n\n*⏰ Vaqt:* ${escapeMarkdown(time)}`;

    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_ADMIN_CHANNEL_ID,
        text: rendered_message,
        parse_mode: "Markdown",
      }
    );

    console.log(`✅ Telegram Response: ${response.data}`);
  } catch (err) {
    console.error(
      `❌ Telegram API Error: ${err.message}`,
      err.response?.data || err
    );
  }
};

module.exports = SendOrderMessage;
