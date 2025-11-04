/**
 * Mac Window шаблон (Sharp версия - стильный современный дизайн)
 *
 * Особенности:
 * - SVG-based рендеринг для идеальной чёткости
 * - Реалистичные кнопки с градиентами и бликами
 * - Современный title bar с градиентом
 * - Мягкая тень с gaussian blur
 * - Минималистичный дизайн в стиле macOS Sonoma/Sequoia
 */

const sharp = require('sharp');
const { createBackground } = require('../backgrounds/backgroundFactory');

/**
 * Применить Mac Window шаблон
 *
 * @param {Buffer} imageBuffer - Исходное изображение
 * @param {Object} backgroundConfig - Конфигурация фона (type + config)
 * @param {Object} config - Общие настройки (radius, shadow, padding)
 * @param {Object} templateSettings - Настройки шаблона (windowButtons)
 * @returns {Promise<Buffer>} Обработанное изображение
 */
async function apply(imageBuffer, backgroundConfig, config, templateSettings = {}) {
  // Константы дизайна (современный macOS)
  const TITLE_BAR_HEIGHT = 52;
  const WINDOW_PADDING = 24;
  const WINDOW_RADIUS = 20;
  const BUTTON_RADIUS = 7;
  const BUTTON_SPACING = 9;
  const PADDING = config.padding || 60;

  try {
    // 1. Получить размеры исходного изображения
    const imageMetadata = await sharp(imageBuffer).metadata();
    const imageWidth = imageMetadata.width;
    const imageHeight = imageMetadata.height;

    // 2. Размеры окна
    const windowWidth = imageWidth + (WINDOW_PADDING * 2);
    const windowHeight = imageHeight + TITLE_BAR_HEIGHT + (WINDOW_PADDING * 2);

    // 3. Размеры холста
    const canvasWidth = windowWidth + (PADDING * 2);
    const canvasHeight = windowHeight + (PADDING * 2);

    // 4. Создать фон
    const background = await createBackground(
      backgroundConfig.type,
      canvasWidth,
      canvasHeight,
      backgroundConfig.config
    );

    // 5. Позиция окна на холсте
    const windowX = PADDING;
    const windowY = PADDING;

    // 6. Создать SVG окна с тенью, title bar и кнопками
    const windowSvg = `
      <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Тень окна -->
          <filter id="windowShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="${config.shadow?.blur || 30}"/>
            <feOffset dx="${config.shadow?.offsetX || 0}" dy="${config.shadow?.offsetY + 5 || 15}" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.25"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <!-- Градиент title bar -->
          <linearGradient id="titleBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#EBEBEB" />
            <stop offset="100%" stop-color="#D5D5D5" />
          </linearGradient>

          <!-- Градиенты для кнопок -->
          <radialGradient id="redButtonGrad" cx="50%" cy="30%">
            <stop offset="0%" stop-color="#FF6B68" />
            <stop offset="100%" stop-color="#FF5F56" />
          </radialGradient>
          <radialGradient id="yellowButtonGrad" cx="50%" cy="30%">
            <stop offset="0%" stop-color="#FFC941" />
            <stop offset="100%" stop-color="#FFBD2E" />
          </radialGradient>
          <radialGradient id="greenButtonGrad" cx="50%" cy="30%">
            <stop offset="0%" stop-color="#2DD14C" />
            <stop offset="100%" stop-color="#27C93F" />
          </radialGradient>

          <!-- Блик для кнопок -->
          <radialGradient id="buttonHighlight" cx="50%" cy="20%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.5)" />
            <stop offset="70%" stop-color="rgba(255,255,255,0.1)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <!-- Фон окна с тенью -->
        <rect
          x="${windowX}"
          y="${windowY}"
          width="${windowWidth}"
          height="${windowHeight}"
          rx="${WINDOW_RADIUS}"
          fill="#F6F6F6"
          filter="url(#windowShadow)"
        />

        <!-- Title bar -->
        <rect
          x="${windowX}"
          y="${windowY}"
          width="${windowWidth}"
          height="${TITLE_BAR_HEIGHT}"
          rx="${WINDOW_RADIUS}"
          fill="url(#titleBarGradient)"
        />
        <!-- Перекрыть нижние углы title bar -->
        <rect
          x="${windowX}"
          y="${windowY + TITLE_BAR_HEIGHT - WINDOW_RADIUS}"
          width="${windowWidth}"
          height="${WINDOW_RADIUS}"
          fill="url(#titleBarGradient)"
        />

        <!-- Верхний блик на title bar -->
        <line
          x1="${windowX + WINDOW_RADIUS}"
          y1="${windowY + 1.5}"
          x2="${windowX + windowWidth - WINDOW_RADIUS}"
          y2="${windowY + 1.5}"
          stroke="rgba(255,255,255,0.6)"
          stroke-width="1"
          stroke-linecap="round"
        />

        ${templateSettings.windowButtons !== false ? `
        <!-- Кнопки окна (более стильные, без двойного наложения) -->
        <g>
          <!-- Красная кнопка (Close) -->
          <circle
            cx="${windowX + 20}"
            cy="${windowY + TITLE_BAR_HEIGHT / 2}"
            r="${BUTTON_RADIUS}"
            fill="#FF5F57"
            filter="drop-shadow(0 0.5px 0 rgba(255,255,255,0.5)) drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
          />
          <circle
            cx="${windowX + 20}"
            cy="${windowY + TITLE_BAR_HEIGHT / 2 - 0.5}"
            r="${BUTTON_RADIUS - 1}"
            fill="url(#redButtonGrad)"
          />

          <!-- Жёлтая кнопка (Minimize) -->
          <circle
            cx="${windowX + 20 + (BUTTON_RADIUS * 2 + BUTTON_SPACING)}"
            cy="${windowY + TITLE_BAR_HEIGHT / 2}"
            r="${BUTTON_RADIUS}"
            fill="#FFBD2E"
            filter="drop-shadow(0 0.5px 0 rgba(255,255,255,0.5)) drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
          />
          <circle
            cx="${windowX + 20 + (BUTTON_RADIUS * 2 + BUTTON_SPACING)}"
            cy="${windowY + TITLE_BAR_HEIGHT / 2 - 0.5}"
            r="${BUTTON_RADIUS - 1}"
            fill="url(#yellowButtonGrad)"
          />

          <!-- Зелёная кнопка (Maximize) -->
          <circle
            cx="${windowX + 20 + (BUTTON_RADIUS * 2 + BUTTON_SPACING) * 2}"
            cy="${windowY + TITLE_BAR_HEIGHT / 2}"
            r="${BUTTON_RADIUS}"
            fill="#28C940"
            filter="drop-shadow(0 0.5px 0 rgba(255,255,255,0.5)) drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
          />
          <circle
            cx="${windowX + 20 + (BUTTON_RADIUS * 2 + BUTTON_SPACING) * 2}"
            cy="${windowY + TITLE_BAR_HEIGHT / 2 - 0.5}"
            r="${BUTTON_RADIUS - 1}"
            fill="url(#greenButtonGrad)"
          />
        </g>
        ` : ''}
      </svg>
    `;

    // 7. Позиция скриншота внутри окна
    const screenshotX = windowX + WINDOW_PADDING;
    const screenshotY = windowY + TITLE_BAR_HEIGHT + WINDOW_PADDING;

    // 8. Создать белый фон под скриншот (округлённый)
    const imageBackgroundSvg = `
      <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="${screenshotX}"
          y="${screenshotY}"
          width="${imageWidth}"
          height="${imageHeight}"
          rx="8"
          fill="#FFFFFF"
        />
      </svg>
    `;

    // 9. Обрезать углы скриншота
    const roundedScreenshot = await sharp(imageBuffer)
      .resize(imageWidth, imageHeight, { fit: 'contain' })
      .composite([
        {
          input: Buffer.from(`
            <svg width="${imageWidth}" height="${imageHeight}">
              <rect width="${imageWidth}" height="${imageHeight}" rx="8" fill="white"/>
            </svg>
          `),
          blend: 'dest-in'
        }
      ])
      .png()
      .toBuffer();

    // 10. Composite всех слоёв
    const result = await sharp(background)
      .composite([
        // Окно с тенью и title bar
        { input: Buffer.from(windowSvg), top: 0, left: 0 },
        // Белый фон под скриншот
        { input: Buffer.from(imageBackgroundSvg), top: 0, left: 0 },
        // Скриншот с округлёнными углами
        { input: roundedScreenshot, top: screenshotY, left: screenshotX }
      ])
      .png()
      .toBuffer();

    return result;

  } catch (error) {
    console.error('❌ Ошибка Mac Window шаблона:', error);
    throw new Error(`Не удалось применить Mac Window шаблон: ${error.message}`);
  }
}

module.exports = {
  apply
};
