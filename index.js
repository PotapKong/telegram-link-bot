const TelegramBot = require('node-telegram-bot-api');
const { URLSearchParams } = require('url');

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('ERROR: BOT_TOKEN is not set in environment variables!');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Обработка ошибок polling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.code, error.message);
});

// Глобальная обработка необработанных ошибок
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, stopping bot...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, stopping bot...');
  bot.stopPolling();
  process.exit(0);
});

// хранилище состояний пользователей
const userStates = new Map();

// Логирование при старте
console.log('Bot is starting...');
bot.getMe().then((botInfo) => {
  console.log(`Bot started successfully! Username: @${botInfo.username}`);
}).catch((error) => {
  console.error('Failed to get bot info:', error);
});

bot.onText(/\/start/, async (msg) => {
  try {
    await bot.sendMessage(msg.chat.id, 'Привет! Используйте /link для преобразования ссылки.');
    userStates.delete(msg.chat.id);
  } catch (error) {
    console.error('Error in /start command:', error);
  }
});

bot.onText(/\/link/, async (msg) => {
  try {
    userStates.set(msg.chat.id, { step: 'waiting_link' });
    await bot.sendMessage(msg.chat.id, 'Отправьте ссылку или пересланный пост:');
  } catch (error) {
    console.error('Error in /link command:', error);
  }
});

bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const state = userStates.get(chatId);

    if (!state) return;

    if (state.step === 'waiting_link') {
      let link = null;

      if (msg.text && msg.text.includes('t.me/')) {
        link = extractTelegramLink(msg.text);
      } else if (msg.forward_from_chat && msg.forward_from_message_id) {
        const username = msg.forward_from_chat.username;
        const messageId = msg.forward_from_message_id;
        if (username && messageId) {
          link = `https://t.me/${username}/${messageId}`;
        }
      }

      if (!link) {
        await bot.sendMessage(chatId, 'Не удалось получить ссылку. Попробуйте ещё раз.');
        return;
      }

      userStates.set(chatId, { step: 'waiting_desc', link });
      await bot.sendMessage(chatId, 'Теперь отправьте описание к этой ссылке:');
    }
    else if (state.step === 'waiting_desc') {
      const description = msg.text || '';
      const shareLink = makeShareLink(state.link, description);
      await bot.sendMessage(chatId, `Готовая ссылка:\n${shareLink}`);
      userStates.delete(chatId);
    }
  } catch (error) {
    console.error('Error handling message:', error);
    try {
      await bot.sendMessage(msg.chat.id, 'Произошла ошибка. Попробуйте ещё раз или используйте /start для начала.');
    } catch (err) {
      console.error('Failed to send error message:', err);
    }
  }
});

function extractTelegramLink(text) {
  const regex = /https?:\/\/t\.me\/[\w\d_]+\/\d+/i;
  const match = text.match(regex);
  return match ? match[0] : text.trim();
}

function makeShareLink(postUrl, description) {
  const params = new URLSearchParams();
  params.append('url', postUrl);
  params.append('text', description);
  // Исправляем плюсы на %20
  return `https://t.me/share/url?${params.toString().replace(/\+/g, '%20')}`;
}

