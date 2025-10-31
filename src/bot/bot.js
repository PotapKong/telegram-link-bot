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
}

/**
 * Инициализация бота
 */
async function initBot() {
  setupErrorHandlers();

  try {
    const botInfo = await bot.getMe();
    console.log('✅ Bot started successfully!');
    console.log(`📱 Username: @${botInfo.username}`);
    console.log(`🆔 Bot ID: ${botInfo.id}`);
    console.log('🚀 Ready to receive messages...');
  } catch (error) {
    console.error('❌ Failed to get bot info:', error);
    process.exit(1);
  }
}

module.exports = { bot, initBot };
