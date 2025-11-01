/**
 * Telegram Link Bot - Точка входа
 *
 * Бот для преобразования Telegram-ссылок в share-ссылки с описанием
 */

const { bot, initBot } = require('./bot/bot');
const {
  handleStart,
  handleHelp,
  handleLink,
  handleCancel
} = require('./handlers/commands');
const { handleMessage } = require('./handlers/messages');
const { handleInlineQuery } = require('./handlers/inline');

/**
 * Регистрация обработчиков команд
 */
function registerCommandHandlers() {
  bot.onText(/\/start/, (msg) => handleStart(bot, msg));
  bot.onText(/\/help/, (msg) => handleHelp(bot, msg));
  bot.onText(/\/link/, (msg) => handleLink(bot, msg));
  bot.onText(/\/cancel/, (msg) => handleCancel(bot, msg));
}

/**
 * Регистрация обработчиков сообщений
 */
function registerMessageHandlers() {
  bot.on('message', (msg) => handleMessage(bot, msg));
}

/**
 * Регистрация inline-обработчика
 */
function registerInlineHandlers() {
  bot.on('inline_query', (query) => handleInlineQuery(bot, query));
}

/**
 * Главная функция запуска бота
 */
async function main() {
  console.log('🤖 Запуск Telegram Link Bot...\n');

  // Инициализация бота
  await initBot();

  // Регистрация всех обработчиков
  registerCommandHandlers();
  registerMessageHandlers();
  registerInlineHandlers();

  console.log('\n✨ Все обработчики зарегистрированы. Бот работает!\n');
}

// Запуск бота
main().catch((error) => {
  console.error('❌ Не удалось запустить бота:', error);
  process.exit(1);
});
