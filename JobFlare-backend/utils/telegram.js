import axios from 'axios';

/**
 * Send a notification to Telegram
 * @param {string} message - The message to send
 */
export const sendTelegramMessage = async (message) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram notification skipped: Token or Chat ID not configured');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });
    console.log('✅ Telegram notification sent');
  } catch (error) {
    console.error('❌ Telegram notification error:', error.response?.data || error.message);
  }
};
