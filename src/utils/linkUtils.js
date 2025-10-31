const { URLSearchParams } = require('url');

/**
 * Извлекает Telegram-ссылку из текста
 * @param {string} text - Текст, содержащий ссылку
 * @returns {string|null} - Найденная ссылка или исходный текст
 */
function extractTelegramLink(text) {
  const regex = /https?:\/\/t\.me\/[\w\d_]+\/\d+/i;
  const match = text.match(regex);
  return match ? match[0] : text.trim();
}

/**
 * Извлекает ссылку из пересланного сообщения
 * @param {object} msg - Объект сообщения от Telegram
 * @returns {string|null} - Сформированная ссылка или null
 */
function extractLinkFromForwarded(msg) {
  if (msg.forward_from_chat && msg.forward_from_message_id) {
    const username = msg.forward_from_chat.username;
    const messageId = msg.forward_from_message_id;
    if (username && messageId) {
      return `https://t.me/${username}/${messageId}`;
    }
  }
  return null;
}

/**
 * Создает share-ссылку для Telegram
 * @param {string} postUrl - URL поста
 * @param {string} description - Описание
 * @returns {string} - Готовая share-ссылка
 */
function makeShareLink(postUrl, description) {
  const params = new URLSearchParams();
  params.append('url', postUrl);
  params.append('text', description);
  // Исправляем плюсы на %20 для корректного отображения пробелов
  return `https://t.me/share/url?${params.toString().replace(/\+/g, '%20')}`;
}

/**
 * Валидация Telegram-ссылки
 * @param {string} link - Ссылка для проверки
 * @returns {boolean} - true если ссылка валидна
 */
function isValidTelegramLink(link) {
  const regex = /^https?:\/\/t\.me\/[\w\d_]+\/\d+$/i;
  return regex.test(link);
}

module.exports = {
  extractTelegramLink,
  extractLinkFromForwarded,
  makeShareLink,
  isValidTelegramLink
};
