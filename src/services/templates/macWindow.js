/**
 * Шаблон в стиле окна macOS
 */

const { createCanvas } = require('canvas');
const { applyGradient, drawRoundedRect } = require('../../utils/canvasUtils');

/**
 * Применить Mac Window шаблон
 */
async function apply(originalImage, gradient, config, templateSettings) {
  const TITLE_BAR_HEIGHT = 40;
  const WINDOW_PADDING = 20;

  // Размеры окна
  const windowWidth = originalImage.width + (WINDOW_PADDING * 2);
  const windowHeight = originalImage.height + TITLE_BAR_HEIGHT + (WINDOW_PADDING * 2);

  // Размеры финального холста с отступами
  const canvasWidth = windowWidth + (config.padding * 2);
  const canvasHeight = windowHeight + (config.padding * 2);

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // 1. Нарисовать градиентный фон
  ctx.fillStyle = applyGradient(ctx, gradient, canvasWidth, canvasHeight);
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Позиция окна на холсте (с учётом отступов)
  const windowX = config.padding;
  const windowY = config.padding;

  // 2. Нарисовать тень окна
  ctx.shadowBlur = config.shadow.blur;
  ctx.shadowOffsetX = config.shadow.offsetX;
  ctx.shadowOffsetY = config.shadow.offsetY;
  ctx.shadowColor = config.shadow.color;

  // 3. Нарисовать фон окна (белый)
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, windowX, windowY, windowWidth, windowHeight, config.radius);
  ctx.fill();

  // Сбросить тень
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // 4. Нарисовать title bar (серый градиент)
  ctx.save();
  drawRoundedRect(ctx, windowX, windowY, windowWidth, windowHeight, config.radius);
  ctx.clip();

  const titleGradient = ctx.createLinearGradient(
    windowX, windowY,
    windowX, windowY + TITLE_BAR_HEIGHT
  );
  titleGradient.addColorStop(0, '#E8E8E8');
  titleGradient.addColorStop(1, '#D1D1D1');

  ctx.fillStyle = titleGradient;
  ctx.fillRect(windowX, windowY, windowWidth, TITLE_BAR_HEIGHT);

  // Линия под title bar
  ctx.strokeStyle = '#C0C0C0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(windowX, windowY + TITLE_BAR_HEIGHT);
  ctx.lineTo(windowX + windowWidth, windowY + TITLE_BAR_HEIGHT);
  ctx.stroke();

  ctx.restore();

  // 5. Нарисовать кнопки окна (красная, жёлтая, зелёная)
  if (templateSettings.windowButtons !== false) {
    const buttonRadius = 6;
    const buttonSpacing = 8;
    const buttonY = windowY + TITLE_BAR_HEIGHT / 2;
    const buttonStartX = windowX + 15;

    // Красная кнопка (закрыть)
    ctx.fillStyle = '#FF5F57';
    ctx.beginPath();
    ctx.arc(buttonStartX, buttonY, buttonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Жёлтая кнопка (свернуть)
    ctx.fillStyle = '#FFBD2E';
    ctx.beginPath();
    ctx.arc(buttonStartX + buttonRadius * 2 + buttonSpacing, buttonY, buttonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Зелёная кнопка (развернуть)
    ctx.fillStyle = '#28C840';
    ctx.beginPath();
    ctx.arc(buttonStartX + buttonRadius * 4 + buttonSpacing * 2, buttonY, buttonRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Нарисовать скриншот
  ctx.save();
  const imageX = windowX + WINDOW_PADDING;
  const imageY = windowY + TITLE_BAR_HEIGHT + WINDOW_PADDING;

  // Обрезать углы скриншота
  const imageRadius = Math.max(0, config.radius - 4);
  drawRoundedRect(ctx, imageX, imageY, originalImage.width, originalImage.height, imageRadius);
  ctx.clip();

  ctx.drawImage(originalImage, imageX, imageY);
  ctx.restore();

  return canvas.toBuffer('image/png');
}

module.exports = { apply };
