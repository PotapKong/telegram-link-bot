/**
 * Сервис обработки изображений для создания стилизованных скриншотов
 * Использует Sharp для высокопроизводительной обработки изображений
 */

const macWindowTemplate = require('./templates/macWindow');
const iphoneTemplate = require('./templates/iphone');
const layeredTemplate = require('./templates/layered');

/**
 * Обработать скриншот с выбранным шаблоном
 *
 * @param {Buffer} imageBuffer - Буфер исходного изображения
 * @param {Object} template - Объект шаблона из БД
 * @param {Object} backgroundConfig - Конфигурация фона (type + config)
 * @param {string} backgroundConfig.type - Тип фона: 'gradient', 'solid', 'blur'
 * @param {Object} backgroundConfig.config - Настройки фона (зависит от типа)
 * @param {Object} settings - Пользовательские настройки
 * @param {number} settings.radius - Радиус скругления углов (0-50)
 * @param {Object} settings.shadow - Настройки тени
 * @param {number} settings.shadow.blur - Размытие тени (0-50)
 * @param {number} settings.shadow.offsetX - Смещение тени по X
 * @param {number} settings.shadow.offsetY - Смещение тени по Y
 * @param {string} settings.shadow.color - Цвет тени
 * @returns {Promise<Buffer>} Буфер обработанного изображения
 */
async function processScreenshot(imageBuffer, template, backgroundConfig, settings = {}) {
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
    // Выбрать шаблон и применить обработку
    let result;
    switch (template.type) {
      case 'mac-window':
        result = await macWindowTemplate.apply(imageBuffer, backgroundConfig, config, template.settings);
        break;
      case 'iphone':
        result = await iphoneTemplate.apply(imageBuffer, backgroundConfig, config, template.settings);
        break;
      case 'layered':
        result = await layeredTemplate.apply(imageBuffer, backgroundConfig, config, template.settings);
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

module.exports = {
  processScreenshot
};
