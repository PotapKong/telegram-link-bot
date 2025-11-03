/**
 * Фабрика для создания фонов разных типов
 */

const gradientBackground = require('./gradientBackground');
const solidBackground = require('./solidBackground');
const blurBackground = require('./blurBackground');

/**
 * Создать фон по типу
 *
 * @param {string} type - Тип фона: 'gradient', 'solid', 'blur'
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {Object} config - Конфигурация (зависит от типа)
 *
 * Gradient config:
 *   - colors: string[] - массив hex-цветов
 *   - angle: number - угол градиента (0-360)
 *   - type: 'linear' | 'radial'
 *
 * Solid config:
 *   - color: string - hex цвет
 *
 * Blur config:
 *   - sourceImage: Buffer - исходное изображение
 *   - blurAmount: number - сила размытия (1-1000)
 *   - brightness: number - яркость (-1 до 1)
 *   - saturation: number - насыщенность (0-2)
 *
 * @returns {Promise<Buffer>} PNG буфер фона
 */
async function createBackground(type, width, height, config) {
  // Валидация размеров
  if (!width || !height || width <= 0 || height <= 0) {
    throw new Error(`Некорректные размеры фона: ${width}x${height}`);
  }

  switch (type) {
    case 'gradient':
      return await gradientBackground.generate(width, height, config);

    case 'solid':
      return await solidBackground.generate(width, height, config);

    case 'blur':
      return await blurBackground.generate(width, height, config);

    default:
      throw new Error(`Неизвестный тип фона: ${type}. Доступны: gradient, solid, blur`);
  }
}

module.exports = {
  createBackground
};
