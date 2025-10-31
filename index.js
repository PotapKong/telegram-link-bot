const TelegramBot = require('node-telegram-bot-api');
const { URLSearchParams } = require('url');

const token = process.env.BOT_TOKEN || '7060066084:AAFliUkwYDoEZk4B0jnKa37zn40v-L9lfYY'; // используем переменную окружения, по умолчанию ваш токен

const bot = new TelegramBot(token, { polling: true });

// хранилище состояний пользователей
const userStates = new Map();

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Привет! Используйте /link для преобразования ссылки.');
  userStates.delete(msg.chat.id);
});

bot.onText(/\/link/, (msg) => {
  userStates.set(msg.chat.id, { step: 'waiting_link' });
  bot.sendMessage(msg.chat.id, 'Отправьте ссылку или пересланный пост:');
});

bot.on('message', async (msg) => {
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
      bot.sendMessage(chatId, 'Не удалось получить ссылку. Попробуйте ещё раз.');
      return;
    }

    userStates.set(chatId, { step: 'waiting_desc', link });
    bot.sendMessage(chatId, 'Теперь отправьте описание к этой ссылке:');
  }
  else if (state.step === 'waiting_desc') {
    const description = msg.text || '';
    const shareLink = makeShareLink(state.link, description);
    bot.sendMessage(chatId, `Готовая ссылка:\n${shareLink}`);
    userStates.delete(chatId);
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

