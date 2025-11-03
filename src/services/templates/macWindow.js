/**
 * Шаблон в стиле окна macOS (улучшенная версия)
 */

const { createCanvas } = require('canvas');
const { applyGradient, drawRoundedRect } = require('../../utils/canvasUtils');

/**
 * Применить Mac Window шаблон
 */
async function apply(originalImage, gradient, config, templateSettings) {
  const TITLE_BAR_HEIGHT = 52; // Увеличен для более современного вида
  const WINDOW_PADDING = 24; // Увеличен паддинг
  const WINDOW_RADIUS = 20; // Больше скругление для стильности

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

  // 2. Нарисовать мягкую тень окна (более реалистичная)
  ctx.shadowBlur = config.shadow.blur * 1.2;
  ctx.shadowOffsetX = config.shadow.offsetX;
  ctx.shadowOffsetY = config.shadow.offsetY + 5;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';

  // 3. Нарисовать фон окна (светло-серый для современности)
  ctx.fillStyle = '#F6F6F6';
  drawRoundedRect(ctx, windowX, windowY, windowWidth, windowHeight, WINDOW_RADIUS);
  ctx.fill();

  // Сбросить тень
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // 4. Нарисовать title bar (современный градиент)
  ctx.save();
  drawRoundedRect(ctx, windowX, windowY, windowWidth, windowHeight, WINDOW_RADIUS);
  ctx.clip();

  const titleGradient = ctx.createLinearGradient(
    windowX, windowY,
    windowX, windowY + TITLE_BAR_HEIGHT
  );
  titleGradient.addColorStop(0, '#EBEBEB');
  titleGradient.addColorStop(1, '#D5D5D5');

  ctx.fillStyle = titleGradient;
  ctx.fillRect(windowX, windowY, windowWidth, TITLE_BAR_HEIGHT);

  // Тонкая светлая линия сверху (блик)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(windowX + WINDOW_RADIUS, windowY + 1);
  ctx.lineTo(windowX + windowWidth - WINDOW_RADIUS, windowY + 1);
  ctx.stroke();

  // Линия под title bar (более контрастная)
  ctx.strokeStyle = '#B8B8B8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(windowX, windowY + TITLE_BAR_HEIGHT);
  ctx.lineTo(windowX + windowWidth, windowY + TITLE_BAR_HEIGHT);
  ctx.stroke();

  ctx.restore();

  // 5. Нарисовать кнопки окна (более крупные и современные)
  if (templateSettings.windowButtons !== false) {
    const buttonRadius = 7; // Увеличены кнопки
    const buttonSpacing = 9;
    const buttonY = windowY + TITLE_BAR_HEIGHT / 2;
    const buttonStartX = windowX + 20;

    // Функция для рисования кнопки с тенью
    const drawButton = (x, y, color, hoverColor) => {
      // Внутренняя тень
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, buttonRadius, 0, Math.PI * 2);
      ctx.fill();

      // Блик сверху
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      const highlight = ctx.createRadialGradient(x, y - 2, 0, x, y, buttonRadius);
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.arc(x, y, buttonRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    // Красная кнопка (закрыть)
    drawButton(buttonStartX, buttonY, '#FF5F56', '#FF6259');

    // Жёлтая кнопка (свернуть)
    drawButton(buttonStartX + (buttonRadius * 2 + buttonSpacing), buttonY, '#FFBD2E', '#FFC12F');

    // Зелёная кнопка (развернуть)
    drawButton(buttonStartX + (buttonRadius * 2 + buttonSpacing) * 2, buttonY, '#27C93F', '#28CD41');

    // Сбросить тень после кнопок
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // 6. Нарисовать скриншот
  ctx.save();
  const imageX = windowX + WINDOW_PADDING;
  const imageY = windowY + TITLE_BAR_HEIGHT + WINDOW_PADDING;

  // Обрезать углы скриншота (уменьшенное скругление для контента)
  const imageRadius = 8;
  drawRoundedRect(ctx, imageX, imageY, originalImage.width, originalImage.height, imageRadius);
  ctx.clip();

  // Белый фон под изображением
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(imageX, imageY, originalImage.width, originalImage.height);

  ctx.drawImage(originalImage, imageX, imageY);
  ctx.restore();

  return canvas.toBuffer('image/png');
}

module.exports = { apply };
