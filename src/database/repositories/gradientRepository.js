/**
 * Repository для работы с градиентами
 */

const db = require('../db');

/**
 * Получить все активные градиенты
 */
async function getAllActive() {
  const result = await db.query(
    'SELECT * FROM gradients WHERE is_active = true ORDER BY sort_order, id'
  );
  return result.rows;
}

/**
 * Получить градиент по slug
 */
async function getBySlug(slug) {
  const result = await db.query(
    'SELECT * FROM gradients WHERE slug = $1 AND is_active = true',
    [slug]
  );
  return result.rows[0];
}

/**
 * Получить градиент по ID
 */
async function getById(id) {
  const result = await db.query(
    'SELECT * FROM gradients WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

/**
 * Создать новый градиент
 */
async function create(gradient) {
  const result = await db.query(
    `INSERT INTO gradients (slug, name, colors, angle, is_active, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      gradient.slug,
      gradient.name,
      JSON.stringify(gradient.colors),
      gradient.angle || 135,
      gradient.is_active !== false,
      gradient.sort_order || 0
    ]
  );
  return result.rows[0];
}

module.exports = {
  getAllActive,
  getBySlug,
  getById,
  create
};
