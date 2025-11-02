/**
 * Repository для работы с шаблонами
 */

const db = require('../db');

/**
 * Получить все активные шаблоны
 */
async function getAllActive() {
  const result = await db.query(
    'SELECT * FROM templates WHERE is_active = true ORDER BY sort_order, id'
  );
  return result.rows;
}

/**
 * Получить шаблон по slug
 */
async function getBySlug(slug) {
  const result = await db.query(
    'SELECT * FROM templates WHERE slug = $1 AND is_active = true',
    [slug]
  );
  return result.rows[0];
}

/**
 * Получить шаблон по ID
 */
async function getById(id) {
  const result = await db.query(
    'SELECT * FROM templates WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

/**
 * Создать новый шаблон
 */
async function create(template) {
  const result = await db.query(
    `INSERT INTO templates (slug, name, description, type, settings, is_active, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      template.slug,
      template.name,
      template.description,
      template.type,
      JSON.stringify(template.settings),
      template.is_active !== false,
      template.sort_order || 0
    ]
  );
  return result.rows[0];
}

/**
 * Обновить шаблон
 */
async function update(id, template) {
  const result = await db.query(
    `UPDATE templates
     SET name = $1, description = $2, settings = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING *`,
    [
      template.name,
      template.description,
      JSON.stringify(template.settings),
      template.is_active,
      id
    ]
  );
  return result.rows[0];
}

module.exports = {
  getAllActive,
  getBySlug,
  getById,
  create,
  update
};
