const {
  extractTelegramLink,
  makeShareLink,
  isValidTelegramLink
} = require('../utils/linkUtils');
const { generateScreenshotInline } = require('./screenshot');

const BOT_USERNAME = "snapkit_bot";
const OPEN_BOT_LINK_MD = '[Открыть чат с ботом](https://t.me/snapkit_bot)';

/**
 * Обработка inline-запросов
 */
async function handleInlineQuery(bot, query) {
  try {
    const queryText = query.query.trim();

    // Если запрос пустой, показываем меню с командами
    if (!queryText) {
      return await showMainMenu(bot, query);
    }

    // Определяем команду (первое слово)
    const parts = queryText.split(' ');
    const command = parts[0].toLowerCase();

    // Обработка команд
    if (command === 'help') {
      return await handleHelpCommand(bot, query);
    }

    if (command === 'link') {
      const linkQuery = parts.slice(1).join(' ');
      return await handleLinkCommand(bot, query, linkQuery);
    }

    if (command === 'screenshot') {
      const fallbackResult = {
        type: 'article',
        id: 'inline-screen-error',
        title: 'Оформление скриншота',
        description: 'Перейдите в чат с ботом для загрузки изображения',
        input_message_content: {
          message_text: `⚠️ В inline-режиме Telegram невозможно прикрепить изображение. Для оформления скриншота:\n\n${OPEN_BOT_LINK_MD}\n\n1. Перейдите в чат с ботом\n2. Отправьте команду /screenshot\n3. Прикрепите картинку и выберите шаблон`,
          parse_mode: 'Markdown'
        },
        reply_markup: {
          inline_keyboard: [[{
            text: 'Открыть бот для скриншота',
            url: `https://t.me/${BOT_USERNAME}`
          }]]
        }
      };
      await bot.answerInlineQuery(query.id, [fallbackResult], {
        cache_time: 300,
        switch_pm_text: 'Открыть бот для скриншота',
        switch_pm_parameter: 'screenshot'
      });
      return;
    }

    return await handleLinkCommand(bot, query, queryText);

  } catch (error) {
    console.error('❌ Ошибка при обработке inline-запроса:', error);
    try {
      await bot.answerInlineQuery(query.id, [], {
        cache_time: 0,
        is_personal: true
      });
    } catch (err) {
      console.error('❌ Не удалось ответить на inline-запрос:', err);
    }
  }
}

async function showMainMenu(bot, query) {
  const mainMenuText = `⚡ SnapKit — Inline команды\n\n📝 Доступные команды:\n\n🔗 link — Создать share-ссылку\n   @snapkit_bot link https://t.me/... Описание\n\n💡 help — Показать справку\n   @snapkit_bot help\n\n🎯 Быстрый режим (без команды):\n   @snapkit_bot https://t.me/... Описание\n\n🖼 screenshot — оформление скриншота (только через чат)\n${OPEN_BOT_LINK_MD}\n\nЩелк — и готово! 🚀`;
  const results = [
    {
      type: 'article',
      id: '0',
      title: '⚡ Команды SnapKit',
      description: 'Доступные inline-команды',
      input_message_content: {
        message_text: mainMenuText,
        parse_mode: 'Markdown'
      },
      reply_markup: {
        inline_keyboard: [[{
          text: 'Открыть бот для скриншота',
          url: `https://t.me/${BOT_USERNAME}`
        }]]
      }
    },
    {
      type: 'article',
      id: '1',
      title: '💡 Справка',
      description: 'Показать инструкцию по использованию',
      input_message_content: {
        message_text: `⚡ SnapKit — мгновенный inline-режим!\n\nПримеры:\n• @snapkit_bot help\n• @snapkit_bot link https://t.me/channel/123\n• @snapkit_bot https://t.me/durov/123 Пост\n• @snapkit_bot screenshot (только текст)\n\nДля оформления скриншота отправьте команду /screenshot в чат с ботом, прикрепите изображение и выберите шаблон.\n\n${OPEN_BOT_LINK_MD}`,
        parse_mode: 'Markdown'
      },
      reply_markup: {
        inline_keyboard: [[{
          text: 'Открыть бот для скриншота',
          url: `https://t.me/${BOT_USERNAME}`
        }]]
      }
    }
  ];

  await bot.answerInlineQuery(query.id, results, {
    cache_time: 300,
    is_personal: true,
    switch_pm_text: 'Открыть бот для скриншота',
    switch_pm_parameter: 'screenshot'
  });
}

... (остальной код не изменился)
