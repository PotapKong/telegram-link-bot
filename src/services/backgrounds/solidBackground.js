/**
 * Генератор однотонных фонов
 */

const sharp = require('sharp');

/**
 * Парсинг hex цвета в RGB
 *
 * @param {string} hex - Hex цвет (#RRGGBB или #RGB)
 * @returns {Object} {r, g, b}
 */
function parseHexColor(hex) {
  // Удалить # если есть
  hex = hex.replace('#', '');

  // Если короткий формат (#RGB) - преобразовать в #RRGGBB
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  // Валидация
  if (hex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
    throw new Error(`Некорректный hex цвет: #${hex}`);
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * Создать однотонный фон
 *
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {Object} config - Конфигурация цвета
 * @param {string} config.color - Hex цвет (#RRGGBB или #RGB)
 * @returns {Promise<Buffer>} PNG буфер
 */
async function generate(width, height, config) {
  const { color = '#3498DB' } = config;

  // Парсинг hex цвета
  const { r, g, b } = parseHexColor(color);

  return await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r, g, b, alpha: 1 }
    }
  })
  .png()
  .toBuffer();
}

module.exports = {
  generate,
  parseHexColor // Экспорт для тестов
};
