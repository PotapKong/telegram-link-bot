/**
 * Шаблон iPhone mockup
 */

const { createCanvas } = require('canvas');
const { applyGradient, drawRoundedRect } = require('../../utils/canvasUtils');

/**
 * Применить iPhone mockup шаблон
 */
async function apply(originalImage, gradient, config, templateSettings) {
  const DEVICE_BEZEL = 12; // Рамка устройства
  const DEVICE_RADIUS = 45; // Радиус скругления устройства
  const NOTCH_WIDTH = 180;
  const NOTCH_HEIGHT = 30;
  const HOME_INDICATOR_WIDTH = 140;
  const HOME_INDICATOR_HEIGHT = 5;
  const HOME_INDICATOR_MARGIN = 10;

  const deviceColor = templateSettings.deviceColor || 'black';

  // Размеры устройства
  const deviceWidth = originalImage.width + (DEVICE_BEZEL * 2);
  const deviceHeight = originalImage.height + (DEVICE_BEZEL * 2);

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

  // 2. Нарисовать тень устройства
  ctx.shadowBlur = config.shadow.blur;
  ctx.shadowOffsetX = config.shadow.offsetX;
  ctx.shadowOffsetY = config.shadow.offsetY;
  ctx.shadowColor = config.shadow.color;

  // 3. Нарисовать корпус устройства
  ctx.fillStyle = deviceColor === 'white' ? '#F5F5F7' : '#2C2C2E';
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
  const screenRadius = DEVICE_RADIUS - DEVICE_BEZEL;

  drawRoundedRect(ctx, screenX, screenY, originalImage.width, originalImage.height, screenRadius);
  ctx.clip();

  // Фон экрана (чёрный)
  ctx.fillStyle = '#000000';
  ctx.fillRect(screenX, screenY, originalImage.width, originalImage.height);

  // Нарисовать скриншот
  ctx.drawImage(originalImage, screenX, screenY);

  ctx.restore();

  // 5. Нарисовать notch (вырез для камеры)
  ctx.save();
  const notchX = deviceX + deviceWidth / 2 - NOTCH_WIDTH / 2;
  const notchY = deviceY + DEVICE_BEZEL;

  ctx.fillStyle = deviceColor === 'white' ? '#F5F5F7' : '#2C2C2E';
  drawRoundedRect(ctx, notchX, notchY, NOTCH_WIDTH, NOTCH_HEIGHT, 18);
  ctx.fill();

  // Динамик (тёмная линия в notch)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  const speakerWidth = 60;
  const speakerHeight = 5;
  const speakerX = deviceX + deviceWidth / 2 - speakerWidth / 2;
  const speakerY = notchY + 8;
  drawRoundedRect(ctx, speakerX, speakerY, speakerWidth, speakerHeight, 3);
  ctx.fill();

  // Камера (маленький кружок)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.arc(speakerX + speakerWidth + 12, speakerY + 2.5, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // 6. Нарисовать home indicator (белая полоска внизу)
  const indicatorX = deviceX + deviceWidth / 2 - HOME_INDICATOR_WIDTH / 2;
  const indicatorY = deviceY + deviceHeight - DEVICE_BEZEL - HOME_INDICATOR_MARGIN - HOME_INDICATOR_HEIGHT;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
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
