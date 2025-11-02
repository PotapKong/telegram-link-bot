/**
 * Сервис логирования в n8n через webhook
 */

const axios = require('axios');

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const WEBHOOK_ENABLED = process.env.N8N_ENABLED === 'true';

/**
 * Отправить событие в n8n webhook
 */
async function logEvent(eventType, data) {
  // Если webhook отключен, пропустить
  if (!WEBHOOK_ENABLED || !WEBHOOK_URL) {
    return;
  }

  try {
    const payload = {
      timestamp: new Date().toISOString(),
      event: eventType,
      data: data,
      source: 'snapkit-bot'
    };

    await axios.post(WEBHOOK_URL, payload, {
      timeout: 5000, // 5 секунд таймаут
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`📤 Webhook отправлен: ${eventType}`);
  } catch (error) {
    // Не прерывать работу бота при ошибке webhook
    console.error('⚠️ Ошибка отправки webhook:', error.message);
  }
}

/**
 * Логировать обработку скриншота
 */
async function logScreenshotProcessed(userId, username, template, gradient, processingTime) {
  await logEvent('screenshot_processed', {
    user_id: userId,
    username: username,
    template: {
      id: template.id,
      slug: template.slug,
      name: template.name,
      type: template.type
    },
    gradient: {
      id: gradient.id,
      slug: gradient.slug,
      name: gradient.name
    },
    processing_time_ms: processingTime
  });
}

/**
 * Логировать ошибку обработки
 */
async function logError(userId, errorType, errorMessage, context = {}) {
  await logEvent('error', {
    user_id: userId,
    error_type: errorType,
    error_message: errorMessage,
    context: context
  });
}

/**
 * Логировать использование команды
 */
async function logCommand(userId, username, command) {
  await logEvent('command_used', {
    user_id: userId,
    username: username,
    command: command
  });
}

/**
 * Логировать создание share-ссылки
 */
async function logLinkCreated(userId, username, linkType) {
  await logEvent('link_created', {
    user_id: userId,
    username: username,
    link_type: linkType
  });
}

/**
 * Логировать использование inline-режима
 */
async function logInlineQuery(userId, username, queryType) {
  await logEvent('inline_query', {
    user_id: userId,
    username: username,
    query_type: queryType
  });
}

module.exports = {
  logEvent,
  logScreenshotProcessed,
  logError,
  logCommand,
  logLinkCreated,
  logInlineQuery
};
