/**
 * Инициализация и настройка Telegram бота
 */

const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/config');

// Валидация конфигурации
config.validate();

// Создание экземпляра бота
const bot = new TelegramBot(config.botToken, { polling: true });

/**
 * Настройка обработчиков ошибок
 */
function setupErrorHandlers() {
  // Обработка ошибок polling
  bot.on('polling_error', (error) => {
    console.error('❌ Ошибка polling:', error.code, error.message);
  });

  // Глобальная обработка необработанных ошибок
  process.on('uncaughtException', (error) => {
    console.error('❌ Необработанное исключение:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Необработанное отклонение промиса:', promise, 'причина:', reason);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('⏹️  Получен сигнал SIGINT, останавливаю бота...');
    bot.stopPolling();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('⏹️  Получен сигнал SIGTERM, останавливаю бота...');
    bot.stopPolling();
    process.exit(0);
  });
}

/**
 * Инициализация бота
 */
async function initBot() {
  setupErrorHandlers();

  try {
    const botInfo = await bot.getMe();
    console.log('✅ Бот успешно запущен!');
    console.log(`📱 Имя пользователя: @${botInfo.username}`);
    console.log(`🆔 ID бота: ${botInfo.id}`);
    console.log('🚀 Готов к приёму сообщений...');
  } catch (error) {
    console.error('❌ Не удалось получить информацию о боте:', error);
    process.exit(1);
  }
}

module.exports = { bot, initBot };
