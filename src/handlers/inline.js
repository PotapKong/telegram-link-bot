/**
 * Обработчик inline-запросов с поддержкой команд
 */

const {
  extractTelegramLink,
  makeShareLink,
  isValidTelegramLink
} = require('../utils/linkUtils');

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
      // Убираем команду "link" из запроса
      const linkQuery = parts.slice(1).join(' ');
      return await handleLinkCommand(bot, query, linkQuery);
    }

    // Если команда не найдена, обрабатываем как обычную ссылку
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

/**
 * Показать главное меню (при пустом запросе)
 */
async function showMainMenu(bot, query) {
  const results = [
    {
      type: 'article',
      id: '0',
      title: '⚡ Команды SnapKit',
      description: 'Доступные inline-команды',
      input_message_content: {
        message_text: `⚡ **SnapKit — Inline команды**

📝 **Доступные команды:**

🔗 **link** — Создать share-ссылку
   @snapkit_bot link https://t.me/... Описание

💡 **help** — Показать справку
   @snapkit_bot help

🎯 **Быстрый режим** (без команды):
   @snapkit_bot https://t.me/... Описание

Щелк — и готово! 🚀`,
        parse_mode: 'Markdown'
      }
    },
    {
      type: 'article',
      id: '1',
      title: '💡 Справка',
      description: 'Показать инструкцию по использованию',
      input_message_content: {
        message_text: '⚡ SnapKit — мгновенный inline-режим!\n\n**Примеры:**\n• @snapkit_bot help\n• @snapkit_bot link https://t.me/channel/123\n• @snapkit_bot https://t.me/durov/123 Пост\n\n**Скоро:**\n• @snapkit_bot video <url>\n• @snapkit_bot template <name>\n\nЩелк — и готово! 🚀',
        parse_mode: 'Markdown'
      }
    }
  ];

  await bot.answerInlineQuery(query.id, results, {
    cache_time: 300,
    is_personal: true,
    switch_pm_text: 'Открыть бота',
    switch_pm_parameter: 'start'
  });
}

/**
 * Обработка команды help
 */
async function handleHelpCommand(bot, query) {
  const results = [
    {
      type: 'article',
      id: 'help-1',
      title: '📖 Справка SnapKit',
      description: 'Полная инструкция по использованию',
      input_message_content: {
        message_text: `📖 **SnapKit — Справка по inline-режиму**

⚡ **Inline-команды:**

\`@snapkit_bot help\`
Показать эту справку

\`@snapkit_bot link <url> <описание>\`
Создать share-ссылку с описанием

\`@snapkit_bot <url> <описание>\`
Быстрый режим (без команды "link")

🎯 **Примеры:**
\`\`\`
@snapkit_bot help
@snapkit_bot link https://t.me/durov/123 Пост
@snapkit_bot https://t.me/telegram/456 Новости
\`\`\`

🔮 **Скоро появится:**
• \`video\` — обработка видео
• \`template\` — применить шаблон
• \`image\` — обработка картинок

Щелк — и готово! 🚀`,
        parse_mode: 'Markdown'
      }
    },
    {
      type: 'article',
      id: 'help-2',
      title: '🎯 Быстрые примеры',
      description: 'Готовые примеры для копирования',
      input_message_content: {
        message_text: `⚡ **Быстрые примеры использования:**

**Создать ссылку:**
@snapkit_bot https://t.me/durov/123

**С описанием:**
@snapkit_bot https://t.me/telegram/456 Важные новости

**Через команду link:**
@snapkit_bot link https://t.me/channel/789 Описание

**Справка:**
@snapkit_bot help

💡 Копируйте и вставляйте в любой чат!`,
        parse_mode: 'Markdown'
      }
    }
  ];

  await bot.answerInlineQuery(query.id, results, {
    cache_time: 300,
    is_personal: true
  });
}

/**
 * Обработка команды link (создание share-ссылки)
 */
async function handleLinkCommand(bot, query, queryText) {
  // Если запрос пустой после команды
  if (!queryText || queryText.trim() === '') {
    const results = [
      {
        type: 'article',
        id: 'link-empty',
        title: '⚠️ Укажите ссылку',
        description: 'Формат: @snapkit_bot link https://t.me/...',
        input_message_content: {
          message_text: '⚠️ Не указана ссылка!\n\n**Правильный формат:**\n`@snapkit_bot link https://t.me/channel/123 Описание`\n\nИли без команды:\n`@snapkit_bot https://t.me/channel/123 Описание`',
          parse_mode: 'Markdown'
        }
      }
    ];

    await bot.answerInlineQuery(query.id, results, {
      cache_time: 30,
      is_personal: true
    });
    return;
  }

  // Пытаемся извлечь ссылку и описание
  const parts = queryText.split(' ');
  let link = null;
  let description = '';

  // Ищем ссылку в тексте
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].includes('t.me/')) {
      link = extractTelegramLink(parts[i]);
      // Всё после ссылки - описание
      description = parts.slice(i + 1).join(' ');
      break;
    }
  }

  if (!link) {
    const results = [
      {
        type: 'article',
        id: 'link-notfound',
        title: '⚠️ Ссылка не найдена',
        description: 'Вставьте корректную ссылку на Telegram-пост',
        input_message_content: {
          message_text: '❌ Не удалось найти ссылку на Telegram-пост.\n\n**Правильный формат:**\n`https://t.me/channel/123`\n`t.me/durov/456`\n\n**Примеры:**\n`@snapkit_bot https://t.me/telegram/123`\n`@snapkit_bot link https://t.me/durov/456 Описание`',
          parse_mode: 'Markdown'
        }
      }
    ];

    await bot.answerInlineQuery(query.id, results, {
      cache_time: 30,
      is_personal: true
    });
    return;
  }

  // Создаем share-ссылку
  const shareLink = makeShareLink(link, description);

  const results = [
    {
      type: 'article',
      id: 'link-share',
      title: '⚡ Share-ссылка готова!',
      description: description || 'Щелк — и готово! Нажмите для отправки',
      input_message_content: {
        message_text: shareLink
      }
    },
    {
      type: 'article',
      id: 'link-original',
      title: '📋 Оригинальная ссылка',
      description: link,
      input_message_content: {
        message_text: link
      }
    }
  ];

  // Если есть описание, добавляем вариант с форматированным текстом
  if (description) {
    results.push({
      type: 'article',
      id: 'link-formatted',
      title: '📝 С описанием',
      description: `${description}\n${link}`,
      input_message_content: {
        message_text: `${description}\n\n${shareLink}`
      }
    });
  }

  await bot.answerInlineQuery(query.id, results, {
    cache_time: 60,
    is_personal: true
  });
}

module.exports = {
  handleInlineQuery
};
