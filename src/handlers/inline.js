/**
 * Обработчик inline-запросов
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

    // Если запрос пустой, показываем инструкцию
    if (!queryText) {
      const results = [
        {
          type: 'article',
          id: '0',
          title: '📖 Как использовать inline-режим',
          description: 'Вставьте ссылку на Telegram-пост после @bot_username',
          input_message_content: {
            message_text: '💡 Для использования inline-режима:\n\n1. Напишите @bot_username\n2. Вставьте ссылку на Telegram-пост\n3. Добавьте описание через пробел\n\nПример: @bot_username https://t.me/channel/123 Интересный пост'
          }
        }
      ];

      await bot.answerInlineQuery(query.id, results, {
        cache_time: 300,
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
          id: '1',
          title: '⚠️ Ссылка не найдена',
          description: 'Вставьте корректную ссылку на Telegram-пост (t.me/channel/123)',
          input_message_content: {
            message_text: '❌ Не удалось найти ссылку на Telegram-пост.\n\nИспользуйте формат: https://t.me/channel/123'
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
        id: '2',
        title: '✨ Share-ссылка создана',
        description: description || 'Нажмите для отправки ссылки',
        input_message_content: {
          message_text: shareLink
        }
      },
      {
        type: 'article',
        id: '3',
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
        id: '4',
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
  } catch (error) {
    console.error('Error handling inline query:', error);
    try {
      // Отправляем пустой результат в случае ошибки
      await bot.answerInlineQuery(query.id, [], {
        cache_time: 0,
        is_personal: true
      });
    } catch (err) {
      console.error('Failed to answer inline query:', err);
    }
  }
}

module.exports = {
  handleInlineQuery
};
