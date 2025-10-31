/**
 * Обработчики команд бота
 */

const userStates = require('../bot/state');

/**
 * Обработчик команды /start
 */
async function handleStart(bot, msg) {
  try {
    const welcomeMessage = `👋 Привет! Я помогу создать красивые ссылки для Telegram.

📝 Доступные команды:
/link - Создать share-ссылку
/help - Показать справку
/cancel - Отменить текущую операцию

Также вы можете использовать inline-режим: напишите @bot_username и вставьте ссылку.`;

    await bot.sendMessage(msg.chat.id, welcomeMessage);
    userStates.delete(msg.chat.id);
  } catch (error) {
    console.error('Error in /start command:', error);
  }
}

/**
 * Обработчик команды /help
 */
async function handleHelp(bot, msg) {
  try {
    const helpMessage = `📖 Справка по использованию бота

🔗 Создание share-ссылки:
1. Отправьте команду /link
2. Отправьте ссылку на Telegram-пост или перешлите пост
3. Введите описание для ссылки
4. Получите готовую share-ссылку

⚡ Inline-режим:
Напишите @bot_username в любом чате, затем вставьте ссылку на пост.

🎯 Примеры:
• Отправить ссылку: https://t.me/channel/123
• Переслать пост из канала
• Inline: @bot_username https://t.me/channel/123

📋 Команды:
/start - Начать работу
/link - Создать ссылку
/help - Эта справка
/cancel - Отменить текущую операцию

💡 Совет: Используйте inline-режим для быстрого создания ссылок!`;

    await bot.sendMessage(msg.chat.id, helpMessage);
  } catch (error) {
    console.error('Error in /help command:', error);
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
    console.error('Error in /link command:', error);
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
    console.error('Error in /cancel command:', error);
  }
}

module.exports = {
  handleStart,
  handleHelp,
  handleLink,
  handleCancel
};
