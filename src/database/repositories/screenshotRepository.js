/**
 * Repository для работы с историей скриншотов
 */

const db = require('../db');

/**
 * Сохранить обработанный скриншот
 */
async function create(screenshot) {
  const result = await db.query(
    `INSERT INTO user_screenshots
     (user_id, username, template_id, gradient_id, settings, original_file_id, processed_file_id, processing_time_ms)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      screenshot.user_id,
      screenshot.username,
      screenshot.template_id,
      screenshot.gradient_id,
      JSON.stringify(screenshot.settings),
      screenshot.original_file_id,
      screenshot.processed_file_id,
      screenshot.processing_time_ms
    ]
  );
  return result.rows[0];
}

/**
 * Получить историю пользователя
 */
async function getUserHistory(userId, limit = 10) {
  const result = await db.query(
    `SELECT us.*, t.name as template_name, g.name as gradient_name
     FROM user_screenshots us
     LEFT JOIN templates t ON us.template_id = t.id
     LEFT JOIN gradients g ON us.gradient_id = g.id
     WHERE us.user_id = $1
     ORDER BY us.created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

/**
 * Получить статистику пользователя
 */
async function getUserStats(userId) {
  const result = await db.query(
    `SELECT
       COUNT(*) as total_screenshots,
       AVG(processing_time_ms) as avg_processing_time,
       MIN(created_at) as first_screenshot,
       MAX(created_at) as last_screenshot
     FROM user_screenshots
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
}

module.exports = {
  create,
  getUserHistory,
  getUserStats
};
