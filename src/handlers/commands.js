/**
 * Обработчики команд бота
 */

const userStates = require('../bot/state');

/**
 * Обработчик команды /start
 */
async function handleStart(bot, msg) {
  try {
    const welcomeMessage = `👋 Привет! Я SnapKit — твой мгновенный набор для контента.

⚡ Что я умею:
• Создавать share-ссылки с описаниями
• Работать в inline-режиме (быстро!)
• [Скоро] Обработка видео и плашек

📝 Доступные команды:
/link - Создать share-ссылку
/help - Показать справку
/cancel - Отменить операцию

💡 Inline-режим: @snapkit_bot [ссылка] [описание]

Щелк — и готово! 🚀`;

    await bot.sendMessage(msg.chat.id, welcomeMessage);
    userStates.delete(msg.chat.id);
  } catch (error) {
    console.error('❌ Ошибка в команде /start:', error);
  }
}

/**
 * Обработчик команды /help
 */
async function handleHelp(bot, msg) {
  try {
    const helpMessage = `📖 Справка по использованию SnapKit

🔗 Создание share-ссылки:
1. Отправьте команду /link
2. Отправьте ссылку на Telegram-пост или перешлите пост
3. Введите описание для ссылки
4. Получите готовую share-ссылку

⚡ Inline-режим (быстрее!):
Напишите @snapkit_bot в любом чате, затем вставьте ссылку на пост.

🎯 Примеры:
• Диалог: /link → ссылка → описание
• Пересылка: /link → [переслать пост] → описание
• Inline: @snapkit_bot https://t.me/channel/123 Описание

📋 Команды:
/start - Начать работу
/link - Создать ссылку
/help - Эта справка
/cancel - Отменить текущую операцию

💡 Совет: Inline-режим работает мгновенно — щелк и готово! ⚡`;

    await bot.sendMessage(msg.chat.id, helpMessage);
  } catch (error) {
    console.error('❌ Ошибка в команде /help:', error);
  }
}

/**
 * Обработчик команды /link
 */
async function handleLink(bot, msg) {
  try {
    userStates.set(msg.chat.id, { step: 'waiting_link' });
    await bot.sendMessage(
      msg.chat.id,
      '🔗 Отправьте ссылку на Telegram-пост или перешлите пост из канала:'
    );
  } catch (error) {
    console.error('❌ Ошибка в команде /link:', error);
  }
}

/**
 * Обработчик команды /cancel
 */
async function handleCancel(bot, msg) {
  try {
    const state = userStates.get(msg.chat.id);

    if (state) {
      userStates.delete(msg.chat.id);
      await bot.sendMessage(
        msg.chat.id,
        '❌ Операция отменена. Используйте /link для создания новой ссылки.'
      );
    } else {
      await bot.sendMessage(
        msg.chat.id,
        'ℹ️ Нет активных операций для отмены. Используйте /link для начала работы.'
      );
    }
  } catch (error) {
    console.error('❌ Ошибка в команде /cancel:', error);
  }
}

module.exports = {
  handleStart,
  handleHelp,
  handleLink,
  handleCancel
};
