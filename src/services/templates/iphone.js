/**
 * iPhone 17 Pro шаблон (Sharp версия - реалистичный дизайн)
 *
 * Особенности:
 * - Точные пропорции iPhone 17 Pro Max (2.16:1)
 * - Titanium корпус с металлическим градиентом
 * - Dynamic Island (фирменный вырез)
 * - Cover режим для скриншотов (заполнение экрана)
 * - Фиксированный размер 650px для консистентности
 * - SVG-based рендеринг для идеальной чёткости
 */

const sharp = require('sharp');
const { createBackground } = require('../backgrounds/backgroundFactory');

/**
 * Применить iPhone 17 Pro шаблон
 *
 * @param {Buffer} imageBuffer - Исходное изображение
 * @param {Object} backgroundConfig - Конфигурация фона (type + config)
 * @param {Object} config - Общие настройки (radius, shadow, padding)
 * @param {Object} templateSettings - Настройки шаблона (deviceColor)
 * @returns {Promise<Buffer>} Обработанное изображение
 */
async function apply(imageBuffer, backgroundConfig, config, templateSettings = {}) {
  // Константы iPhone 17 Pro Max
  const PHONE_WIDTH = 650;  // Фиксированный размер
  const PHONE_ASPECT_RATIO = 2.16;  // Пропорции iPhone 17 Pro Max
  const PHONE_HEIGHT = Math.round(PHONE_WIDTH * PHONE_ASPECT_RATIO);

  const DEVICE_BEZEL = 16;  // Толщина рамки
  const DEVICE_RADIUS = 60;  // Скругление корпуса
  const SCREEN_RADIUS = 52;  // Скругление экрана

  const DYNAMIC_ISLAND_WIDTH = 120;
  const DYNAMIC_ISLAND_HEIGHT = 37;
  const DYNAMIC_ISLAND_MARGIN_TOP = 12;

  const PADDING = config.padding || 80;

  // Цвет корпуса (по умолчанию Titanium)
  const deviceColor = templateSettings.deviceColor || 'titanium';

  try {
    // 1. Размеры экрана
    const screenWidth = PHONE_WIDTH;
    const screenHeight = PHONE_HEIGHT;

    // 2. Размеры устройства (с рамкой)
    const deviceWidth = screenWidth + (DEVICE_BEZEL * 2);
    const deviceHeight = screenHeight + (DEVICE_BEZEL * 2);

    // 3. Размеры холста
    const canvasWidth = deviceWidth + (PADDING * 2);
    const canvasHeight = deviceHeight + (PADDING * 2);

    // 4. Создать фон
    const background = await createBackground(
      backgroundConfig.type,
      canvasWidth,
      canvasHeight,
      backgroundConfig.config
    );

    // 5. Позиция устройства
    const deviceX = PADDING;
    const deviceY = PADDING;

    // 6. Цвета корпуса
    let frameColor, highlightColor;
    if (deviceColor === 'titanium') {
      frameColor = '#2C2C2E';
      highlightColor = '#505050';
    } else if (deviceColor === 'black') {
      frameColor = '#1C1C1E';
      highlightColor = '#3C3C3E';
    } else if (deviceColor === 'natural') {
      frameColor = '#D4A574';  // Рыжий (Desert Titanium)
      highlightColor = '#E5B685';
    } else {
      frameColor = '#2C2C2E';  // По умолчанию titanium
      highlightColor = '#505050';
    }

    // 7. Создать SVG корпуса iPhone с тенью и Dynamic Island
    const deviceSvg = `
      <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Тень устройства -->
          <filter id="deviceShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="${config.shadow?.blur * 1.5 || 40}"/>
            <feOffset dx="${config.shadow?.offsetX || 0}" dy="${config.shadow?.offsetY + 10 || 20}" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.35"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <!-- Градиент корпуса (металлический эффект) -->
          <linearGradient id="frameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${frameColor}" />
            <stop offset="50%" stop-color="${highlightColor}" />
            <stop offset="100%" stop-color="${frameColor}" />
          </linearGradient>

          <!-- Блик на рамке -->
          <linearGradient id="bezelHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.1)" />
            <stop offset="50%" stop-color="rgba(255,255,255,0.25)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0.1)" />
          </linearGradient>
        </defs>

        <!-- Корпус устройства -->
        <rect
          x="${deviceX}"
          y="${deviceY}"
          width="${deviceWidth}"
          height="${deviceHeight}"
          rx="${DEVICE_RADIUS}"
          fill="url(#frameGradient)"
          filter="url(#deviceShadow)"
        />

        <!-- Металлический блик -->
        <rect
          x="${deviceX}"
          y="${deviceY}"
          width="${deviceWidth}"
          height="${deviceHeight}"
          rx="${DEVICE_RADIUS}"
          fill="url(#bezelHighlight)"
        />

        <!-- Экран (чёрный фон) -->
        <rect
          x="${deviceX + DEVICE_BEZEL}"
          y="${deviceY + DEVICE_BEZEL}"
          width="${screenWidth}"
          height="${screenHeight}"
          rx="${SCREEN_RADIUS}"
          fill="#000000"
        />

        <!-- Dynamic Island -->
        <ellipse
          cx="${deviceX + deviceWidth / 2}"
          cy="${deviceY + DEVICE_BEZEL + DYNAMIC_ISLAND_MARGIN_TOP + DYNAMIC_ISLAND_HEIGHT / 2}"
          rx="${DYNAMIC_ISLAND_WIDTH / 2}"
          ry="${DYNAMIC_ISLAND_HEIGHT / 2}"
          fill="#0A0A0A"
        />

        <!-- Камера в Dynamic Island (маленький кружок) -->
        <circle
          cx="${deviceX + deviceWidth / 2 + 35}"
          cy="${deviceY + DEVICE_BEZEL + DYNAMIC_ISLAND_MARGIN_TOP + DYNAMIC_ISLAND_HEIGHT / 2}"
          r="4"
          fill="#1A1A1A"
        />
      </svg>
    `;

    // 8. Обработать скриншот - масштабировать в режиме cover
    const resizedScreenshot = await sharp(imageBuffer)
      .resize(screenWidth, screenHeight, {
        fit: 'cover',  // Заполнить экран, обрезать лишнее
        position: 'center'
      })
      .toBuffer();

    // 9. Обрезать углы скриншота под экран И вырезать Dynamic Island
    const islandCenterX = screenWidth / 2;
    const islandCenterY = DYNAMIC_ISLAND_MARGIN_TOP + DYNAMIC_ISLAND_HEIGHT / 2;

    const roundedScreenshot = await sharp(resizedScreenshot)
      .composite([
        {
          input: Buffer.from(`
            <svg width="${screenWidth}" height="${screenHeight}">
              <defs>
                <mask id="screenMask">
                  <!-- Белый прямоугольник экрана -->
                  <rect width="${screenWidth}" height="${screenHeight}" rx="${SCREEN_RADIUS}" fill="white"/>
                  <!-- Чёрный эллипс Dynamic Island (вырез) -->
                  <ellipse
                    cx="${islandCenterX}"
                    cy="${islandCenterY}"
                    rx="${DYNAMIC_ISLAND_WIDTH / 2 + 2}"
                    ry="${DYNAMIC_ISLAND_HEIGHT / 2 + 2}"
                    fill="black"
                  />
                </mask>
              </defs>
              <!-- Применяем маску -->
              <rect width="${screenWidth}" height="${screenHeight}" fill="white" mask="url(#screenMask)"/>
            </svg>
          `),
          blend: 'dest-in'
        }
      ])
      .png()
      .toBuffer();

    // 10. Позиция скриншота
    const screenX = deviceX + DEVICE_BEZEL;
    const screenY = deviceY + DEVICE_BEZEL;

    // 11. Composite всех слоёв
    const result = await sharp(background)
      .composite([
        // Корпус iPhone с тенью
        { input: Buffer.from(deviceSvg), top: 0, left: 0 },
        // Скриншот на экране
        { input: roundedScreenshot, top: screenY, left: screenX }
      ])
      .png()
      .toBuffer();

    return result;

  } catch (error) {
    console.error('❌ Ошибка iPhone шаблона:', error);
    throw new Error(`Не удалось применить iPhone шаблон: ${error.message}`);
  }
}

module.exports = {
  apply
};
