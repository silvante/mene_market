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

    let rendered_message = `${title}\n\nhabar:\n${message}`;

    if (warning) rendered_message += `\n\neslatma:\n${warning}`;
    if (desc) rendered_message += `\n\nizoh:\n${desc}`;
    if (order_code) rendered_message += `\n\nBuyurtma kodi:\n${order_code}`;
    if (balance) rendered_message += `\n\nhozirda hisobingizda:\n${balance}`;

    rendered_message += `\n\nofficial website: menemarket.uz`;

    const response = await axios.post(
      `https://api.telegram.org/bot${bot_token}/sendMessage`,
      { chat_id: chat_id, text: rendered_message }
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
