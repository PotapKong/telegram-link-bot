/**
 * Health Check HTTP Server
 * Предоставляет /health endpoint для мониторинга состояния приложения
 */

const express = require('express');
const db = require('../database/db');

const app = express();
const PORT = process.env.HEALTH_CHECK_PORT || 3000;

// Статус бота (обновляется из index.js)
let botStatus = {
  isRunning: false,
  username: null,
  botId: null,
  startedAt: null
};

/**
 * Обновить статус бота
 */
function setBotStatus(status) {
  botStatus = {
    ...botStatus,
    ...status,
    startedAt: botStatus.startedAt || new Date().toISOString()
  };
}

/**
 * GET /health - Проверка здоровья приложения
 */
app.get('/health', async (req, res) => {
  try {
    // Проверка подключения к БД
    const dbHealthy = await db.healthCheck();

    // Статус приложения
    const status = {
      status: dbHealthy && botStatus.isRunning ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      bot: {
        running: botStatus.isRunning,
        username: botStatus.username,
        botId: botStatus.botId,
        startedAt: botStatus.startedAt
      },
      database: {
        connected: dbHealthy
      },
      memory: {
        usage: process.memoryUsage(),
        heapUsedMB: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
        rssMB: (process.memoryUsage().rss / 1024 / 1024).toFixed(2)
      },
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform
      }
    };

    // Если всё здорово - 200, иначе - 503
    const httpStatus = status.status === 'healthy' ? 200 : 503;
    res.status(httpStatus).json(status);

  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * GET /ready - Readiness probe (для Kubernetes)
 */
app.get('/ready', async (req, res) => {
  try {
    const dbHealthy = await db.healthCheck();

    if (dbHealthy && botStatus.isRunning) {
      res.status(200).json({ ready: true });
    } else {
      res.status(503).json({ ready: false });
    }
  } catch (error) {
    res.status(503).json({ ready: false, error: error.message });
  }
});

/**
 * GET /live - Liveness probe (для Kubernetes)
 */
app.get('/live', (req, res) => {
  // Простая проверка - процесс жив?
  res.status(200).json({ alive: true });
});

/**
 * GET / - Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    service: 'SnapKit Bot',
    version: '2.1.0',
    endpoints: {
      health: '/health',
      ready: '/ready',
      live: '/live'
    }
  });
});

/**
 * Запустить HTTP сервер
 */
function startHealthCheckServer() {
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, (err) => {
      if (err) {
        console.error('❌ Не удалось запустить health check сервер:', err);
        reject(err);
      } else {
        console.log(`✅ Health check сервер запущен на порту ${PORT}`);
        console.log(`   http://localhost:${PORT}/health`);
        resolve(server);
      }
    });
  });
}

module.exports = {
  startHealthCheckServer,
  setBotStatus,
  app
};
