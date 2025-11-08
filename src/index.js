/**
 * SnapKit Bot - Точка входа
 *
 * Мгновенный набор инструментов для контента
 * Создавайте share-ссылки, обрабатывайте видео, генерируйте плашки
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
const {
  handleScreenshotCommand,
  handlePhoto,
  handleTemplateSelection,
  handleGradientSelection,
  handleBackToTemplates,
  handleCancel: handleScreenshotCancel
} = require('./handlers/screenshot');
const db = require('./database/db');
const { startHealthCheckServer, setBotStatus } = require('./services/healthCheck');

/**
 * Регистрация обработчиков команд
 */
function registerCommandHandlers() {
  bot.onText(/\/start/, (msg) => handleStart(bot, msg));
  bot.onText(/\/help/, (msg) => handleHelp(bot, msg));
  bot.onText(/\/link/, (msg) => handleLink(bot, msg));
  bot.onText(/\/screenshot/, (msg) => handleScreenshotCommand(bot, msg));
  bot.onText(/\/cancel/, (msg) => handleCancel(bot, msg));
}

/**
 * Регистрация обработчиков сообщений
 */
function registerMessageHandlers() {
  // Обработка фото для screenshot feature
  bot.on('photo', (msg) => handlePhoto(bot, msg));

  // Общий обработчик текстовых сообщений
  bot.on('message', (msg) => handleMessage(bot, msg));
}

/**
 * Регистрация inline-обработчика
 */
function registerInlineHandlers() {
  bot.on('inline_query', (query) => handleInlineQuery(bot, query));
}

/**
 * Регистрация обработчика callback queries
 */
function registerCallbackHandlers() {
  bot.on('callback_query', async (query) => {
    const data = query.data;

    if (data.startsWith('template:')) {
      const templateSlug = data.replace('template:', '');
      await handleTemplateSelection(bot, query, templateSlug);
    } else if (data.startsWith('gradient:')) {
      const gradientSlug = data.replace('gradient:', '');
      await handleGradientSelection(bot, query, gradientSlug);
    } else if (data === 'back_to_templates') {
      await handleBackToTemplates(bot, query);
    } else if (data === 'cancel') {
      await handleScreenshotCancel(bot, query);
    }
  });
}

/**
 * Главная функция запуска бота
 */
async function main() {
  console.log('⚡ Запуск SnapKit Bot...\n');

  // Запуск Health Check сервера
  console.log('🏥 Запуск Health Check сервера...');
  await startHealthCheckServer();

  // Инициализация базы данных
  console.log('📊 Подключение к PostgreSQL...');
  await db.initialize();

  // Инициализация бота
  const botInfo = await initBot();

  // Обновить статус бота для health check
  setBotStatus({
    isRunning: true,
    username: botInfo?.username || null,
    botId: botInfo?.id || null
  });

  // Регистрация всех обработчиков
  registerCommandHandlers();
  registerMessageHandlers();
  registerInlineHandlers();
  registerCallbackHandlers();

  console.log('\n✨ Все обработчики зарегистрированы. SnapKit работает!\n');
}

// Запуск бота
main().catch((error) => {
  console.error('❌ Не удалось запустить бота:', error);
  process.exit(1);
});
