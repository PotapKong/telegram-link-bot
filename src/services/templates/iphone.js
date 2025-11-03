/**
 * Шаблон iPhone mockup (улучшенная версия - iPhone 17 Pro Max)
 */

const { createCanvas } = require('canvas');
const { applyGradient, drawRoundedRect } = require('../../utils/canvasUtils');

/**
 * Применить iPhone mockup шаблон
 */
async function apply(originalImage, gradient, config, templateSettings) {
  // Пропорции iPhone 17 Pro Max: примерно 19.5:9
  const PHONE_ASPECT_RATIO = 2.16; // высота / ширина (реальное соотношение iPhone)
  const DEVICE_BEZEL = 16; // Более реалистичная рамка
  const DEVICE_RADIUS = 60; // Скругления как у iPhone 17 Pro
  const SCREEN_RADIUS = 52; // Скругление экрана
  const NOTCH_WIDTH = 135; // Dynamic Island
  const NOTCH_HEIGHT = 40;
  const HOME_INDICATOR_WIDTH = 150;
  const HOME_INDICATOR_HEIGHT = 5;
  const HOME_INDICATOR_MARGIN = 12;

  const deviceColor = templateSettings.deviceColor || 'titanium'; // По умолчанию титан

  // Рассчитать размеры телефона с правильными пропорциями
  // Если изображение не вертикальное - масштабируем его
  let displayWidth, displayHeight;
  let imageScale = 1;

  // Целевая ширина телефона - чуть больше ширины изображения для красоты
  const targetPhoneWidth = Math.min(originalImage.width * 1.2, 450);
  const targetPhoneHeight = targetPhoneWidth * PHONE_ASPECT_RATIO;

  // Размеры экрана (внутри bezel)
  displayWidth = targetPhoneWidth;
  displayHeight = targetPhoneHeight;

  // Размеры всего устройства
  const deviceWidth = displayWidth + (DEVICE_BEZEL * 2);
  const deviceHeight = displayHeight + (DEVICE_BEZEL * 2);

  // Размеры финального холста с отступами
  const canvasWidth = deviceWidth + (config.padding * 2);
  const canvasHeight = deviceHeight + (config.padding * 2);

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // 1. Нарисовать градиентный фон
  ctx.fillStyle = applyGradient(ctx, gradient, canvasWidth, canvasHeight);
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Позиция устройства на холсте
  const deviceX = config.padding;
  const deviceY = config.padding;

  // 2. Нарисовать тень устройства (более мягкая и реалистичная)
  ctx.shadowBlur = config.shadow.blur * 1.5;
  ctx.shadowOffsetX = config.shadow.offsetX;
  ctx.shadowOffsetY = config.shadow.offsetY + 8;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';

  // 3. Нарисовать корпус устройства с реалистичными цветами
  let frameColor;
  if (deviceColor === 'white' || deviceColor === 'silver') {
    frameColor = '#E5E5E5';
  } else if (deviceColor === 'gold') {
    frameColor = '#F5D3A0';
  } else if (deviceColor === 'titanium' || deviceColor === 'natural') {
    frameColor = '#505050';
  } else {
    frameColor = '#1C1C1E'; // black
  }

  ctx.fillStyle = frameColor;
  drawRoundedRect(ctx, deviceX, deviceY, deviceWidth, deviceHeight, DEVICE_RADIUS);
  ctx.fill();

  // Добавить металлический блеск на рамке
  const bezelHighlight = ctx.createLinearGradient(
    deviceX, deviceY,
    deviceX + deviceWidth, deviceY
  );
  bezelHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  bezelHighlight.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  bezelHighlight.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  ctx.fillStyle = bezelHighlight;
  drawRoundedRect(ctx, deviceX, deviceY, deviceWidth, deviceHeight, DEVICE_RADIUS);
  ctx.fill();

  // Сбросить тень
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // 4. Нарисовать экран (область скриншота)
  ctx.save();
  const screenX = deviceX + DEVICE_BEZEL;
  const screenY = deviceY + DEVICE_BEZEL;

  drawRoundedRect(ctx, screenX, screenY, displayWidth, displayHeight, SCREEN_RADIUS);
  ctx.clip();

  // Фон экрана (чёрный)
  ctx.fillStyle = '#000000';
  ctx.fillRect(screenX, screenY, displayWidth, displayHeight);

  // Масштабировать и отцентровать изображение на экране
  const imgAspect = originalImage.width / originalImage.height;
  const screenAspect = displayWidth / displayHeight;

  let drawWidth, drawHeight, drawX, drawY;

  if (imgAspect > screenAspect) {
    // Изображение шире экрана - масштабируем по высоте
    drawHeight = displayHeight;
    drawWidth = drawHeight * imgAspect;
    drawX = screenX + (displayWidth - drawWidth) / 2;
    drawY = screenY;
  } else {
    // Изображение выше экрана - масштабируем по ширине
    drawWidth = displayWidth;
    drawHeight = drawWidth / imgAspect;
    drawX = screenX;
    drawY = screenY + (displayHeight - drawHeight) / 2;
  }

  ctx.drawImage(originalImage, drawX, drawY, drawWidth, drawHeight);

  ctx.restore();

  // 5. Нарисовать Dynamic Island (современный вырез)
  ctx.save();
  const notchX = deviceX + deviceWidth / 2 - NOTCH_WIDTH / 2;
  const notchY = deviceY + DEVICE_BEZEL + 12;

  // Рисуем Dynamic Island с черным фоном и блеском
  ctx.fillStyle = '#0A0A0A';
  drawRoundedRect(ctx, notchX, notchY, NOTCH_WIDTH, NOTCH_HEIGHT, 20);
  ctx.fill();

  // Внутренний блеск
  const islandGlow = ctx.createRadialGradient(
    notchX + NOTCH_WIDTH / 2, notchY + NOTCH_HEIGHT / 2, 0,
    notchX + NOTCH_WIDTH / 2, notchY + NOTCH_HEIGHT / 2, NOTCH_WIDTH / 2
  );
  islandGlow.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
  islandGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = islandGlow;
  drawRoundedRect(ctx, notchX, notchY, NOTCH_WIDTH, NOTCH_HEIGHT, 20);
  ctx.fill();

  // Камера (маленький кружок справа)
  ctx.fillStyle = '#1A1A1A';
  ctx.beginPath();
  ctx.arc(notchX + NOTCH_WIDTH - 25, notchY + NOTCH_HEIGHT / 2, 7, 0, Math.PI * 2);
  ctx.fill();

  // Объектив камеры
  ctx.fillStyle = '#0D0D0D';
  ctx.beginPath();
  ctx.arc(notchX + NOTCH_WIDTH - 25, notchY + NOTCH_HEIGHT / 2, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // 6. Нарисовать home indicator (белая полоска внизу)
  const indicatorX = deviceX + deviceWidth / 2 - HOME_INDICATOR_WIDTH / 2;
  const indicatorY = deviceY + deviceHeight - DEVICE_BEZEL - HOME_INDICATOR_MARGIN - HOME_INDICATOR_HEIGHT;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  drawRoundedRect(
    ctx,
    indicatorX,
    indicatorY,
    HOME_INDICATOR_WIDTH,
    HOME_INDICATOR_HEIGHT,
    HOME_INDICATOR_HEIGHT / 2
  );
  ctx.fill();

  return canvas.toBuffer('image/png');
}

module.exports = { apply };
