/**
 * Обработчик текстовых сообщений
 */

const userStates = require('../bot/state');
const {
  extractTelegramLink,
  extractLinkFromForwarded,
  makeShareLink
} = require('../utils/linkUtils');

/**
 * Обработка входящих сообщений
 */
async function handleMessage(bot, msg) {
  try {
    const chatId = msg.chat.id;
    const state = userStates.get(chatId);

    if (!state) return;

    if (state.step === 'waiting_link') {
      await handleWaitingLink(bot, msg, chatId);
    } else if (state.step === 'waiting_desc') {
      await handleWaitingDescription(bot, msg, chatId, state);
    }
  } catch (error) {
    console.error('Error handling message:', error);
    try {
      await bot.sendMessage(
        msg.chat.id,
        '❌ Произошла ошибка. Попробуйте ещё раз или используйте /cancel для отмены.'
      );
    } catch (err) {
      console.error('Failed to send error message:', err);
    }
  }
}

/**
 * Обработка этапа ожидания ссылки
 */
async function handleWaitingLink(bot, msg, chatId) {
  let link = null;

  // Проверяем текстовое сообщение со ссылкой
  if (msg.text && msg.text.includes('t.me/')) {
    link = extractTelegramLink(msg.text);
  }
  // Проверяем пересланное сообщение
  else if (msg.forward_from_chat || msg.forward_from_message_id) {
    link = extractLinkFromForwarded(msg);
  }

  if (!link) {
    await bot.sendMessage(
      chatId,
      '⚠️ Не удалось получить ссылку. Попробуйте ещё раз или используйте /cancel.'
    );
    return;
  }

  userStates.set(chatId, { step: 'waiting_desc', link });
  await bot.sendMessage(
    chatId,
    `✅ Ссылка получена!\n\n📝 Теперь отправьте описание для этой ссылки:`
  );
}

/**
 * Обработка этапа ожидания описания
 */
async function handleWaitingDescription(bot, msg, chatId, state) {
  const description = msg.text || '';
  const shareLink = makeShareLink(state.link, description);

  await bot.sendMessage(
    chatId,
    `✨ Готовая ссылка для шаринга:\n\n${shareLink}\n\n💡 Используйте /link для создания новой ссылки.`
  );

  userStates.delete(chatId);
}

module.exports = {
  handleMessage
};
