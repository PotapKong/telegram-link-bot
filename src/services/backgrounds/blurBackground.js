/**
 * Генератор размытых фонов из исходного изображения
 */

const sharp = require('sharp');

/**
 * Создать размытый фон из исходного изображения
 *
 * @param {number} width - Ширина итогового фона
 * @param {number} height - Высота итогового фона
 * @param {Object} config - Конфигурация
 * @param {Buffer} config.sourceImage - Исходное изображение
 * @param {number} config.blurAmount - Сила размытия (1-1000, рекомендуется 60-80)
 * @param {number} config.brightness - Яркость (-1 до 1, по умолчанию -0.2)
 * @param {number} config.saturation - Насыщенность (0-2, по умолчанию 1.2)
 * @returns {Promise<Buffer>} PNG буфер
 */
async function generate(width, height, config) {
  const {
    sourceImage,
    blurAmount = 70,
    brightness = -0.2,  // Немного затемняем для лучшей читаемости
    saturation = 1.2    // Немного повышаем насыщенность
  } = config;

  if (!sourceImage) {
    throw new Error('Blur background требует исходное изображение (sourceImage)');
  }

  if (!Buffer.isBuffer(sourceImage)) {
    throw new Error('sourceImage должен быть Buffer');
  }

  // Валидация параметров
  if (blurAmount < 1 || blurAmount > 1000) {
    throw new Error('blurAmount должен быть от 1 до 1000');
  }

  try {
    // Масштабировать исходное изображение до размера фона (cover)
    const resized = await sharp(sourceImage)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .toBuffer();

    // Применить blur и эффекты
    return await sharp(resized)
      .blur(blurAmount)
      .modulate({
        brightness: 1 + brightness,  // Sharp использует множитель (1 = без изменений)
        saturation: saturation
      })
      .png()
      .toBuffer();

  } catch (error) {
    console.error('❌ Ошибка создания blur фона:', error);
    throw new Error(`Не удалось создать blur фон: ${error.message}`);
  }
}

module.exports = {
  generate
};
