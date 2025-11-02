/**
 * Шаблон с несколькими полупрозрачными слоями
 */

const { createCanvas } = require('canvas');
const { applyGradient, drawRoundedRect } = require('../../utils/canvasUtils');

/**
 * Применить Layered шаблон
 */
async function apply(originalImage, gradient, config, templateSettings) {
  const numLayers = templateSettings.layers || 3;
  const layerOpacity = templateSettings.layerOpacity || 0.3;
  const LAYER_OFFSET = 15; // Смещение каждого слоя
  const LAYER_SCALE = 0.95; // Масштаб уменьшения каждого слоя

  // Рассчитать размеры с учётом всех слоёв
  const maxLayerWidth = originalImage.width;
  const maxLayerHeight = originalImage.height;

  // Размеры финального холста с отступами
  const canvasWidth = maxLayerWidth + (config.padding * 2) + (LAYER_OFFSET * numLayers);
  const canvasHeight = maxLayerHeight + (config.padding * 2) + (LAYER_OFFSET * numLayers);

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // 1. Нарисовать градиентный фон
  ctx.fillStyle = applyGradient(ctx, gradient, canvasWidth, canvasHeight);
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Начальная позиция (самый задний слой)
  const startX = config.padding + (LAYER_OFFSET * (numLayers - 1));
  const startY = config.padding + (LAYER_OFFSET * (numLayers - 1));

  // 2. Нарисовать тень для основного слоя
  ctx.shadowBlur = config.shadow.blur;
  ctx.shadowOffsetX = config.shadow.offsetX;
  ctx.shadowOffsetY = config.shadow.offsetY;
  ctx.shadowColor = config.shadow.color;

  // 3. Нарисовать основной слой (скриншот)
  ctx.save();
  const mainX = startX;
  const mainY = startY;

  drawRoundedRect(ctx, mainX, mainY, originalImage.width, originalImage.height, config.radius);
  ctx.clip();

  // Белый фон
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(mainX, mainY, originalImage.width, originalImage.height);

  // Скриншот
  ctx.drawImage(originalImage, mainX, mainY);

  ctx.restore();

  // Сбросить тень
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // 4. Нарисовать полупрозрачные слои позади основного
  for (let i = 1; i <= numLayers; i++) {
    const scale = Math.pow(LAYER_SCALE, i);
    const layerWidth = originalImage.width * scale;
    const layerHeight = originalImage.height * scale;

    // Центрировать слой относительно основного
    const layerX = mainX + (originalImage.width - layerWidth) / 2 - (LAYER_OFFSET * i);
    const layerY = mainY + (originalImage.height - layerHeight) / 2 - (LAYER_OFFSET * i);

    ctx.save();

    // Нарисовать слой
    ctx.globalAlpha = layerOpacity;
    ctx.fillStyle = '#FFFFFF';

    drawRoundedRect(ctx, layerX, layerY, layerWidth, layerHeight, config.radius * scale);
    ctx.fill();

    // Лёгкая тень для каждого слоя
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';

    drawRoundedRect(ctx, layerX, layerY, layerWidth, layerHeight, config.radius * scale);
    ctx.stroke();

    ctx.restore();
  }

  return canvas.toBuffer('image/png');
}

module.exports = { apply };
