const axios = require("axios");
const { LoadToken } = require("./token_loader");

const SendMessage = async (chat_id, data) => {
  try {
    const bot_token = await LoadToken();
    if (!bot_token) console.log("❌ token loading error");
    const { title, message, balance, order_code, desc, warning } = data;

    let rendered_message = `${title} \n\n habar:\n ${message} \n\n ${
      warning && `eslatma: \n` + warning + `\n\n`
    } ${desc && `izoh: \n` + desc + `\n\n`} ${
      order_code && `Buyurtma kodi: \n` + order_code + `\n\n`
    } ${
      balance && `hozirda hisobingizda: \n` + balance + `\n\n`
    } website: https://menemarket.uz`;

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
