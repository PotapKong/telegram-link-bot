/**
 * Layered шаблон на Sharp
 * 3 полупрозрачных слоя сзади, каждый меньше предыдущего, смещение вверх
 */

const sharp = require('sharp');
const { createBackground } = require('../backgrounds/backgroundFactory');

/**
 * Применить Layered шаблон
 *
 * @param {Buffer} imageBuffer - Исходное изображение
 * @param {Object} backgroundConfig - Конфигурация фона (type + config)
 * @param {Object} config - Общие настройки (radius, shadow, padding)
 * @param {Object} templateSettings - Настройки шаблона (outputSize)
 * @returns {Promise<Buffer>} Обработанное изображение
 */
async function apply(imageBuffer, backgroundConfig, config, templateSettings = {}) {
  // Размер итогового изображения (по умолчанию 1080x1080)
  const finalWidth = templateSettings.outputWidth || 1080;
  const finalHeight = templateSettings.outputHeight || 1080;

  try {
    // 1. Получить метаданные скриншота
    const screenshot = sharp(imageBuffer);
    const metadata = await screenshot.metadata();

    // 2. Вычислить размер основного слоя (80% от финального размера)
    const mainLayerWidth = Math.round(finalWidth * 0.8);
    const mainLayerHeight = Math.round(finalHeight * 0.8);

    // 3. Масштабировать скриншот до размера основного слоя (contain)
    const mainLayerBuffer = await screenshot
      .resize(mainLayerWidth, mainLayerHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();

    const mainLayerMeta = await sharp(mainLayerBuffer).metadata();
    const actualMainWidth = mainLayerMeta.width;
    const actualMainHeight = mainLayerMeta.height;

    // 4. Создать 3 задних слоя - каждый меньше предыдущего
    const backLayers = [];
    // Слои уже по высоте, чтобы не выходили за границы
    const layerHeightScales = [0.97, 0.94, 0.91]; // Каждый слой меньше по высоте
    const layerWidthScales = [0.98, 0.96, 0.94];  // Немного уже по ширине
    const layerOpacities = [0.3, 0.2, 0.1]; // От ближнего к дальнему
    const offsetY = -25; // Смещение вверх на 25px для каждого слоя

    for (let i = 0; i < 3; i++) {
      const heightScale = layerHeightScales[i];
      const widthScale = layerWidthScales[i];
      const opacity = layerOpacities[i];
      const layerWidth = Math.round(actualMainWidth * widthScale);
      const layerHeight = Math.round(actualMainHeight * heightScale);

      // Создать SVG прямоугольника с закругленными углами и полупрозрачностью
      const layerSvg = Buffer.from(`
        <svg width="${layerWidth}" height="${layerHeight}">
          <defs>
            <filter id="shadow${i}">
              <feGaussianBlur in="SourceAlpha" stdDeviation="15"/>
              <feOffset dx="0" dy="10" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect
            width="${layerWidth}"
            height="${layerHeight}"
            rx="20"
            ry="20"
            fill="white"
            opacity="${opacity}"
            filter="url(#shadow${i})"
          />
        </svg>
      `);

      backLayers.push({
        input: await sharp(layerSvg).png().toBuffer(),
        width: layerWidth,
        height: layerHeight,
        opacity: opacity,
        offsetY: offsetY * (i + 1) // Смещение вверх: -30, -60, -90
      });
    }

    // 5. Создать фон
    let backgroundBuffer;
    if (backgroundConfig.type === 'blur') {
      // Для blur фона передаём исходный скриншот
      backgroundBuffer = await createBackground(
        backgroundConfig.type,
        finalWidth,
        finalHeight,
        { ...backgroundConfig.config, sourceImage: imageBuffer }
      );
    } else {
      backgroundBuffer = await createBackground(
        backgroundConfig.type,
        finalWidth,
        finalHeight,
        backgroundConfig.config
      );
    }

    // 6. Вычислить позиции для центрирования
    // Центр финального изображения
    const centerX = Math.round(finalWidth / 2);
    const centerY = Math.round(finalHeight / 2);

    // Позиция основного слоя (центр)
    const mainLayerLeft = Math.round(centerX - actualMainWidth / 2);
    const mainLayerTop = Math.round(centerY - actualMainHeight / 2);

    // 7. Составить массив композита (от дальнего к ближнему)
    const compositeArray = [];

    // Задние слои (от дальнего к ближнему: слой 2, 1, 0)
    for (let i = backLayers.length - 1; i >= 0; i--) {
      const layer = backLayers[i];
      const layerLeft = Math.round(centerX - layer.width / 2);
      const layerTop = Math.round(centerY - layer.height / 2) + layer.offsetY;

      compositeArray.push({
        input: layer.input,
        top: layerTop,
        left: layerLeft
      });
    }

    // Основной слой (самый верхний)
    compositeArray.push({
      input: mainLayerBuffer,
      top: mainLayerTop,
      left: mainLayerLeft
    });

    // 8. Собрать итоговое изображение
    const result = await sharp(backgroundBuffer)
      .composite(compositeArray)
      .png()
      .toBuffer();

    console.log(`✅ Layered шаблон: ${finalWidth}x${finalHeight}, основной слой ${actualMainWidth}x${actualMainHeight}, 3 задних слоя`);

    return result;

  } catch (error) {
    console.error('❌ Ошибка генерации Layered шаблона:', error);
    throw new Error(`Не удалось создать Layered шаблон: ${error.message}`);
  }
}

module.exports = {
  apply
};
