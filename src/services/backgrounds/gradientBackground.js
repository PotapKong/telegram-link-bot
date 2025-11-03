/**
 * Генератор градиентных фонов
 */

const sharp = require('sharp');
const { createLinearGradient, createRadialGradient } = require('../../utils/svgGenerator');

/**
 * Создать градиентный фон
 *
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {Object} config - Конфигурация градиента
 * @param {string[]} config.colors - Массив hex-цветов (минимум 2)
 * @param {number} config.angle - Угол градиента (0-360, по умолчанию 135)
 * @param {string} config.type - Тип: 'linear' или 'radial' (по умолчанию 'linear')
 * @returns {Promise<Buffer>} PNG буфер
 */
async function generate(width, height, config) {
  const {
    colors = ['#FF6B6B', '#4ECDC4'],
    angle = 135,
    type = 'linear'
  } = config;

  // Валидация
  if (!Array.isArray(colors) || colors.length < 2) {
    throw new Error('Градиент должен содержать минимум 2 цвета');
  }

  // Создать SVG градиент
  let svgBuffer;
  if (type === 'radial') {
    svgBuffer = createRadialGradient(width, height, colors);
  } else {
    svgBuffer = createLinearGradient(width, height, colors, angle);
  }

  // Конвертировать SVG в PNG через Sharp
  return await sharp(svgBuffer)
    .png()
    .toBuffer();
}

module.exports = {
  generate
};
