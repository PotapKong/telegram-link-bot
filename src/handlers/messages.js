const userStates = require('../bot/state');
const {
  extractTelegramLink,
  extractLinkFromForwarded,
  makeShareLink
} = require('../utils/linkUtils');
const { sendBackgroundKeyboard, handleWaitingBackground, sendSizeKeyboard } = require('./background');
const { sendTemplateKeyboard, handleWaitingTemplate } = require('./messages');

const TEMPLATES = [
  { label: 'iPhone', value: 'iphone' },
  { label: 'Mac', value: 'mac-window' },
  { label: 'Layered', value: 'layered' }
];

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
    } else if (state.step === 'waiting_template') {
      await handleWaitingTemplate(bot, msg, chatId, state);
    } else if (state.step === 'waiting_background') {
      await handleWaitingBackground(bot, msg, chatId, state);
    } else if (state.step === 'waiting_size') {
      // TODO: добавить обработчик выбора размера
    }
  } catch (error) {
    console.error('❌ Ошибка при обработке сообщения:', error);
    try {
      await bot.sendMessage(chatId, '❌ Произошла ошибка. Попробуйте ещё раз или используйте /cancel для отмены.');
    } catch (err) {
      console.error('❌ Не удалось отправить сообщение об ошибке:', err);
    }
  }
}

/**
 * Обработка этапа ожидания ссылки
 */
async function handleWaitingLink(bot, msg, chatId) {
  let link = null;

  if (msg.text && msg.text.includes('t.me/')) {
    link = extractTelegramLink(msg.text);
  } else if (msg.forward_from_chat || msg.forward_from_message_id) {
    link = extractLinkFromForwarded(msg);
  }

  if (!link) {
    await bot.sendMessage(chatId, '⚠️ Не удалось получить ссылку. Попробуйте ещё раз или используйте /cancel.');
    return;
  }

  userStates.set(chatId, { step: 'waiting_desc', link });
  await bot.sendMessage(chatId, `✅ Ссылка получена!\n\n📝 Теперь отправьте описание для этой ссылки:`);
}

/**
 * Обработка этапа ожидания описания
 */
async function handleWaitingDescription(bot, msg, chatId, state) {
  const description = msg.text || '';
  const shareLink = makeShareLink(state.link, description);

  await bot.sendMessage(chatId, `✨ Готовая ссылка для шаринга:\n\n${shareLink}\n\n💡 Используйте /link для создания новой ссылки.`);

  userStates.delete(chatId);
}

/**
 * Обработка этапа выбора шаблона оформления скриншота
 */
async function handleWaitingTemplate(bot, msg, chatId, state) {
  const chosen = TEMPLATES.find(t => t.label.toLowerCase() === msg.text.toLowerCase());

  if (!chosen) {
    await bot.sendMessage(chatId, '❗ Выберите шаблон оформления через кнопку ниже.');
    await sendTemplateKeyboard(bot, chatId);
    return;
  }

  userStates.set(chatId, {
    ...state,
    step: 'waiting_background',
    template: chosen.value
  });

  await bot.sendMessage(chatId, `✅ Выбран шаблон: ${chosen.label}. Теперь выберите цвет или фон для скриншота.`);
  await sendBackgroundKeyboard(bot, chatId);
}

/**
 * Отправить клавиатуру выбора шаблона
 */
async function sendTemplateKeyboard(bot, chatId) {
  return bot.sendMessage(chatId, '🖼 Выберите шаблон оформления:', {
    reply_markup: {
      keyboard: [TEMPLATES.map(t => t.label)],
      one_time_keyboard: true,
      resize_keyboard: true
    }
  });
}

module.exports = {
  handleMessage,
  sendTemplateKeyboard,
  handleWaitingTemplate
};
