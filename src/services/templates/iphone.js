/**
 * iPhone 17 Pro - РЕАЛИСТИЧНЫЙ (переделан с нуля)
 *
 * Основано на точных параметрах iPhone 16 Pro:
 * - Тонкие безели (3px)
 * - Dynamic Island правильной формы (pill, НЕ овал!)
 * - Реалистичные пропорции
 */

const sharp = require('sharp');
const { createBackground } = require('../backgrounds/backgroundFactory');

async function apply(imageBuffer, backgroundConfig, config, templateSettings = {}) {
  // Реалистичные размеры iPhone Pro
  const SCALE = 1.5;
  const PHONE_WIDTH = Math.round(393 * SCALE); // 590px
  const PHONE_HEIGHT = Math.round(852 * SCALE); // 1278px (19.5:9)

  // Тонкие безели как в реальном iPhone
  const BEZEL = 3;
  const DEVICE_RADIUS = Math.round(PHONE_WIDTH * 0.14);
  const SCREEN_RADIUS = DEVICE_RADIUS - BEZEL;

  // Dynamic Island (pill-shaped!)
  const ISLAND_WIDTH = Math.round(PHONE_WIDTH * 0.3); // 30% ширины
  const ISLAND_HEIGHT = Math.round(PHONE_HEIGHT * 0.024); // ~2.4% высоты
  const ISLAND_MARGIN = Math.round(PHONE_HEIGHT * 0.012); // ~1.2% сверху

  const screenW = PHONE_WIDTH - BEZEL * 2;
  const screenH = PHONE_HEIGHT - BEZEL * 2;

  const pad = config.padding || 80;
  const canvasW = PHONE_WIDTH + pad * 2;
  const canvasH = PHONE_HEIGHT + pad * 2;

  try {
    // Фон
    let bg;
    if (backgroundConfig.type === 'blur') {
      bg = await createBackground(backgroundConfig.type, canvasW, canvasH,
        { ...backgroundConfig.config, sourceImage: imageBuffer });
    } else {
      bg = await createBackground(backgroundConfig.type, canvasW, canvasH, backgroundConfig.config);
    }

    // Цвета
    const color = templateSettings.deviceColor || 'titanium';
    let frame, light;
    if (color === 'black') {
      frame = '#1D1D1F';
      light = '#2D2D2F';
    } else if (color === 'natural') {
      frame = '#B8B5AE';
      light = '#C8C5BE';
    } else {
      frame = '#5F6063';
      light = '#7F8083';
    }

    // SVG корпуса
    const phoneSvg = `
      <svg width="${canvasW}" height="${canvasH}">
        <defs>
          <filter id="shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="20"/>
            <feOffset dy="10"/>
            <feComponentTransfer><feFuncA type="linear" slope="0.2"/></feComponentTransfer>
            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${light}"/>
            <stop offset="50%" stop-color="${frame}"/>
            <stop offset="100%" stop-color="${light}"/>
          </linearGradient>
        </defs>

        <!-- Корпус -->
        <rect x="${pad}" y="${pad}" width="${PHONE_WIDTH}" height="${PHONE_HEIGHT}"
              rx="${DEVICE_RADIUS}" fill="url(#metal)" filter="url(#shadow)"/>

        <!-- Экран -->
        <rect x="${pad + BEZEL}" y="${pad + BEZEL}" width="${screenW}" height="${screenH}"
              rx="${SCREEN_RADIUS}" fill="#000"/>

        <!-- Dynamic Island (PILL SHAPE!) -->
        <rect
          x="${pad + BEZEL + (screenW - ISLAND_WIDTH) / 2}"
          y="${pad + BEZEL + ISLAND_MARGIN}"
          width="${ISLAND_WIDTH}"
          height="${ISLAND_HEIGHT}"
          rx="${ISLAND_HEIGHT / 2}"
          fill="#0A0A0A"/>

        <!-- Камера -->
        <circle
          cx="${pad + BEZEL + screenW / 2 + ISLAND_WIDTH * 0.25}"
          cy="${pad + BEZEL + ISLAND_MARGIN + ISLAND_HEIGHT / 2}"
          r="2" fill="#1A1A1A"/>
      </svg>
    `;

    // Скриншот на экран
    const screen = await sharp(imageBuffer)
      .resize(screenW, screenH, { fit: 'cover', position: 'center' })
      .toBuffer();

    // Маска с вырезом для Island
    const masked = await sharp(screen)
      .composite([{
        input: Buffer.from(`
          <svg width="${screenW}" height="${screenH}">
            <defs>
              <mask id="cut">
                <rect width="${screenW}" height="${screenH}" rx="${SCREEN_RADIUS}" fill="white"/>
                <rect x="${(screenW - ISLAND_WIDTH) / 2}" y="${ISLAND_MARGIN}"
                      width="${ISLAND_WIDTH}" height="${ISLAND_HEIGHT}"
                      rx="${ISLAND_HEIGHT / 2}" fill="black"/>
              </mask>
            </defs>
            <rect width="${screenW}" height="${screenH}" fill="white" mask="url(#cut)"/>
          </svg>
        `),
        blend: 'dest-in'
      }])
      .png()
      .toBuffer();

    // Собрать
    const result = await sharp(bg)
      .composite([
        { input: Buffer.from(phoneSvg), top: 0, left: 0 },
        { input: masked, top: pad + BEZEL, left: pad + BEZEL }
      ])
      .png()
      .toBuffer();

    return result;

  } catch (error) {
    console.error('❌ iPhone:', error);
    throw new Error(`iPhone: ${error.message}`);
  }
}

module.exports = { apply };
