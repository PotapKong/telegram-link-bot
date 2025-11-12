/**
 * Генератор SVG для градиентов (используется Sharp)
 */

/**
 * Создать SVG с линейным градиентом
 *
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {string[]} colors - Массив hex-цветов (минимум 2)
 * @param {number} angle - Угол градиента в градусах (0-360)
 * @returns {Buffer} SVG буфер
 */
function createLinearGradient(width, height, colors, angle = 135) {
  // Преобразовать угол в координаты для SVG
  const angleRad = ((angle - 90) * Math.PI) / 180;
  const x1 = Math.round(50 + Math.cos(angleRad) * 50);
  const y1 = Math.round(50 + Math.sin(angleRad) * 50);
  const x2 = Math.round(50 + Math.cos(angleRad + Math.PI) * 50);
  const y2 = Math.round(50 + Math.sin(angleRad + Math.PI) * 50);

  // Создать stops для градиента
  const stops = colors
    .map((color, index) => {
      const offset = (index / (colors.length - 1)) * 100;
      return `<stop offset="${offset}%" stop-color="${color}" />`;
    })
    .join('\n    ');

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          ${stops}
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
    </svg>
  `;

  return Buffer.from(svg.trim());
}

/**
 * Создать SVG с радиальным градиентом
 *
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {string[]} colors - Массив hex-цветов
 * @param {number} cx - Центр X в процентах (0-100)
 * @param {number} cy - Центр Y в процентах (0-100)
 * @returns {Buffer} SVG буфер
 */
function createRadialGradient(width, height, colors, cx = 50, cy = 50) {
  const stops = colors
    .map((color, index) => {
      const offset = (index / (colors.length - 1)) * 100;
      return `<stop offset="${offset}%" stop-color="${color}" />`;
    })
    .join('\n    ');

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad" cx="${cx}%" cy="${cy}%">
          ${stops}
        </radialGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
    </svg>
  `;

  return Buffer.from(svg.trim());
}

/**
 * Создать однотонный SVG прямоугольник
 *
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {string} color - Hex цвет
 * @returns {Buffer} SVG буфер
 */
function createSolidColor(width, height, color) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}" />
    </svg>
  `;

  return Buffer.from(svg.trim());
}

module.exports = {
  createLinearGradient,
  createRadialGradient,
  createSolidColor
};
