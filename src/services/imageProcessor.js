/**
 * Сервис обработки изображений для создания стилизованных скриншотов
 */

const { createCanvas, loadImage } = require('canvas');
const macWindowTemplate = require('./templates/macWindow');
const iphoneTemplate = require('./templates/iphone');
const layeredTemplate = require('./templates/layered');

/**
 * Применить градиент к контексту
 */
function applyGradient(ctx, gradient, width, height) {
  const grad = ctx.createLinearGradient(
    0, 0,
    width * Math.cos(gradient.angle * Math.PI / 180),
    height * Math.sin(gradient.angle * Math.PI / 180)
  );

  gradient.colors.forEach((color, index) => {
    const stop = index / (gradient.colors.length - 1);
    grad.addColorStop(stop, color);
  });

  return grad;
}

/**
 * Обработать скриншот с выбранным шаблоном
 *
 * @param {Buffer} imageBuffer - Буфер исходного изображения
 * @param {Object} template - Объект шаблона из БД
 * @param {Object} gradient - Объект градиента из БД
 * @param {Object} settings - Пользовательские настройки
 * @param {number} settings.radius - Радиус скругления углов (0-50)
 * @param {Object} settings.shadow - Настройки тени
 * @param {number} settings.shadow.blur - Размытие тени (0-50)
 * @param {number} settings.shadow.offsetX - Смещение тени по X
 * @param {number} settings.shadow.offsetY - Смещение тени по Y
 * @param {string} settings.shadow.color - Цвет тени
 * @returns {Promise<Buffer>} Буфер обработанного изображения
 */
async function processScreenshot(imageBuffer, template, gradient, settings = {}) {
  const startTime = Date.now();

  // Настройки по умолчанию
  const config = {
    radius: settings.radius !== undefined ? settings.radius : 12,
    shadow: {
      blur: settings.shadow?.blur || 30,
      offsetX: settings.shadow?.offsetX || 0,
      offsetY: settings.shadow?.offsetY || 10,
      color: settings.shadow?.color || 'rgba(0, 0, 0, 0.3)'
    },
    padding: 60 // Отступы от краёв
  };

  try {
    // Загрузить исходное изображение
    const originalImage = await loadImage(imageBuffer);

    // Выбрать шаблон
    let result;
    switch (template.type) {
      case 'mac-window':
        result = await macWindowTemplate.apply(originalImage, gradient, config, template.settings);
        break;
      case 'iphone':
        result = await iphoneTemplate.apply(originalImage, gradient, config, template.settings);
        break;
      case 'layered':
        result = await layeredTemplate.apply(originalImage, gradient, config, template.settings);
        break;
      default:
        throw new Error(`Неизвестный тип шаблона: ${template.type}`);
    }

    const processingTime = Date.now() - startTime;
    console.log(`✅ Скриншот обработан за ${processingTime}ms с шаблоном ${template.slug}`);

    return {
      buffer: result,
      processingTime
    };

  } catch (error) {
    console.error('❌ Ошибка обработки изображения:', error);
    throw error;
  }
}

/**
 * Нарисовать скруглённый прямоугольник
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

module.exports = {
  processScreenshot,
  applyGradient,
  drawRoundedRect
};
