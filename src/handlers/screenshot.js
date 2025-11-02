/**
 * Обработчик команды /screenshot
 */

const templateRepository = require('../database/repositories/templateRepository');
const gradientRepository = require('../database/repositories/gradientRepository');
const screenshotRepository = require('../database/repositories/screenshotRepository');
const imageProcessor = require('../services/imageProcessor');
const stateManager = require('../utils/stateManager');
const keyboards = require('../utils/keyboards');
const webhookLogger = require('../services/webhookLogger');
const axios = require('axios');

/**
 * Команда /screenshot - начать создание стилизованного скриншота
 */
async function handleScreenshotCommand(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    // Логировать использование команды
    await webhookLogger.logCommand(userId, msg.from.username || null, '/screenshot');

    // Очистить предыдущее состояние
    stateManager.clearState(userId);

    // Установить состояние ожидания фото
    stateManager.setState(userId, {
      step: 'waiting_photo',
      chatId: chatId
    });

    await bot.sendMessage(
      chatId,
      '📸 Отправь мне скриншот, который хочешь оформить.\n\n' +
      'Я могу украсить его одним из стилей:\n' +
      '🖥️ Mac Window — стиль окна macOS\n' +
      '📱 iPhone — мокап iPhone\n' +
      '📚 Layered — многослойный эффект\n\n' +
      'Отправь фото или нажми /cancel для отмены.'
    );
  } catch (error) {
    console.error('❌ Ошибка обработки /screenshot:', error);
    await bot.sendMessage(chatId, '❌ Произошла ошибка. Попробуй ещё раз.');
  }
}

/**
 * Обработка фото от пользователя
 */
async function handlePhoto(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const state = stateManager.getState(userId);

  // Проверить, ждём ли мы фото от этого пользователя
  if (!state || state.step !== 'waiting_photo') {
    return; // Игнорировать, если не в режиме ожидания фото
  }

  try {
    // Получить файл с максимальным разрешением
    const photo = msg.photo[msg.photo.length - 1];
    const fileId = photo.file_id;

    // Показать статус обработки
    const statusMsg = await bot.sendMessage(chatId, '⏳ Загружаю фото...');

    // Скачать файл
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);

    // Сохранить буфер в состоянии
    stateManager.updateState(userId, {
      step: 'selecting_template',
      originalFileId: fileId,
      imageBuffer: imageBuffer
    });

    // Удалить статусное сообщение
    await bot.deleteMessage(chatId, statusMsg.message_id);

    // Загрузить доступные шаблоны
    const templates = await templateRepository.getAllActive();

    // Отправить выбор шаблона
    await bot.sendMessage(
      chatId,
      '✨ Отлично! Теперь выбери стиль оформления:',
      {
        reply_markup: keyboards.createTemplateKeyboard(templates)
      }
    );

  } catch (error) {
    console.error('❌ Ошибка обработки фото:', error);
    await bot.sendMessage(chatId, '❌ Не удалось загрузить фото. Попробуй ещё раз или отправь другое фото.');
  }
}

/**
 * Обработка выбора шаблона
 */
async function handleTemplateSelection(bot, query, templateSlug) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const messageId = query.message.message_id;

  try {
    const state = stateManager.getState(userId);

    if (!state || state.step !== 'selecting_template') {
      await bot.answerCallbackQuery(query.id, { text: '❌ Сессия устарела. Начни заново с /screenshot' });
      return;
    }

    // Загрузить шаблон
    const template = await templateRepository.getBySlug(templateSlug);

    if (!template) {
      await bot.answerCallbackQuery(query.id, { text: '❌ Шаблон не найден' });
      return;
    }

    // Сохранить выбор
    stateManager.updateState(userId, {
      step: 'selecting_gradient',
      template: template
    });

    // Загрузить градиенты
    const gradients = await gradientRepository.getAllActive();

    // Обновить сообщение
    await bot.editMessageText(
      `✅ Выбран стиль: ${template.name}\n\n🎨 Теперь выбери градиент фона:`,
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: keyboards.createGradientKeyboard(gradients)
      }
    );

    await bot.answerCallbackQuery(query.id);

  } catch (error) {
    console.error('❌ Ошибка выбора шаблона:', error);
    await bot.answerCallbackQuery(query.id, { text: '❌ Произошла ошибка' });
  }
}

/**
 * Обработка выбора градиента
 */
async function handleGradientSelection(bot, query, gradientSlug) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const messageId = query.message.message_id;

  try {
    const state = stateManager.getState(userId);

    if (!state || state.step !== 'selecting_gradient') {
      await bot.answerCallbackQuery(query.id, { text: '❌ Сессия устарела. Начни заново с /screenshot' });
      return;
    }

    // Загрузить градиент
    const gradient = await gradientRepository.getBySlug(gradientSlug);

    if (!gradient) {
      await bot.answerCallbackQuery(query.id, { text: '❌ Градиент не найден' });
      return;
    }

    // Обновить сообщение
    await bot.editMessageText(
      `✅ Выбран стиль: ${state.template.name}\n` +
      `✅ Выбран градиент: ${gradient.name}\n\n` +
      `⏳ Обрабатываю изображение...`,
      {
        chat_id: chatId,
        message_id: messageId
      }
    );

    await bot.answerCallbackQuery(query.id);

    // Обработать скриншот
    const result = await imageProcessor.processScreenshot(
      state.imageBuffer,
      state.template,
      gradient,
      {
        radius: 12,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10,
          color: 'rgba(0, 0, 0, 0.3)'
        }
      }
    );

    // Отправить результат
    const sentMessage = await bot.sendPhoto(chatId, result.buffer, {
      caption: `✨ Готово!\n\n` +
               `📐 Стиль: ${state.template.name}\n` +
               `🎨 Градиент: ${gradient.name}\n` +
               `⚡ Обработано за ${result.processingTime}ms`
    });

    // Сохранить в историю
    await screenshotRepository.create({
      user_id: userId,
      username: query.from.username || null,
      template_id: state.template.id,
      gradient_id: gradient.id,
      settings: {
        radius: 12,
        shadow: { blur: 30, offsetX: 0, offsetY: 10 }
      },
      original_file_id: state.originalFileId,
      processed_file_id: sentMessage.photo[sentMessage.photo.length - 1].file_id,
      processing_time_ms: result.processingTime
    });

    // Отправить webhook в n8n
    await webhookLogger.logScreenshotProcessed(
      userId,
      query.from.username || null,
      state.template,
      gradient,
      result.processingTime
    );

    // Очистить состояние
    stateManager.clearState(userId);

    // Удалить сообщение с выбором
    await bot.deleteMessage(chatId, messageId);

    console.log(`✅ Скриншот обработан для пользователя ${userId}`);

  } catch (error) {
    console.error('❌ Ошибка обработки градиента:', error);

    // Получить состояние для логирования
    const currentState = stateManager.getState(userId);

    // Логировать ошибку
    await webhookLogger.logError(userId, 'screenshot_processing_error', error.message, {
      template: currentState?.template?.slug,
      gradient: gradientSlug
    });

    await bot.answerCallbackQuery(query.id, { text: '❌ Произошла ошибка при обработке' });
    await bot.sendMessage(chatId, '❌ Не удалось обработать изображение. Попробуй ещё раз с /screenshot');
    stateManager.clearState(userId);
  }
}

/**
 * Обработка кнопки "Назад к шаблонам"
 */
async function handleBackToTemplates(bot, query) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const messageId = query.message.message_id;

  try {
    const state = stateManager.getState(userId);

    if (!state) {
      await bot.answerCallbackQuery(query.id, { text: '❌ Сессия устарела' });
      return;
    }

    // Вернуть на шаг выбора шаблона
    stateManager.updateState(userId, { step: 'selecting_template' });

    const templates = await templateRepository.getAllActive();

    await bot.editMessageText(
      '✨ Выбери стиль оформления:',
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: keyboards.createTemplateKeyboard(templates)
      }
    );

    await bot.answerCallbackQuery(query.id);

  } catch (error) {
    console.error('❌ Ошибка возврата к шаблонам:', error);
    await bot.answerCallbackQuery(query.id, { text: '❌ Произошла ошибка' });
  }
}

/**
 * Отмена операции
 */
async function handleCancel(bot, query) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  stateManager.clearState(userId);

  await bot.editMessageText(
    '❌ Операция отменена. Используй /screenshot чтобы начать заново.',
    {
      chat_id: chatId,
      message_id: messageId
    }
  );

  await bot.answerCallbackQuery(query.id);
}

module.exports = {
  handleScreenshotCommand,
  handlePhoto,
  handleTemplateSelection,
  handleGradientSelection,
  handleBackToTemplates,
  handleCancel
};
