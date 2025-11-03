/**
 * Шаблон с несколькими полупрозрачными слоями (улучшенная версия)
 * Основной слой 100% непрозрачный на переднем плане
 * Задние слои выглядывают из-за него, становясь меньше и прозрачнее
 */

const { createCanvas } = require('canvas');
const { applyGradient, drawRoundedRect } = require('../../utils/canvasUtils');

/**
 * Применить Layered шаблон
 */
async function apply(originalImage, gradient, config, templateSettings) {
  const numLayers = templateSettings.layers || 3;
  const LAYER_OFFSET_X = 18; // Смещение каждого слоя вправо
  const LAYER_OFFSET_Y = 18; // Смещение каждого слоя вниз
  const LAYER_SCALE_STEP = 0.03; // На сколько каждый слой больше (3%)

  // Базовые настройки для основного слоя
  const mainLayerRadius = config.radius || 16;

  // Рассчитать размеры холста с учётом всех слоёв
  // Задние слои будут выглядывать справа-снизу
  const totalOffsetX = LAYER_OFFSET_X * (numLayers - 1);
  const totalOffsetY = LAYER_OFFSET_Y * (numLayers - 1);

  const canvasWidth = originalImage.width + totalOffsetX + (config.padding * 2);
  const canvasHeight = originalImage.height + totalOffsetY + (config.padding * 2);

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // 1. Нарисовать градиентный фон
  ctx.fillStyle = applyGradient(ctx, gradient, canvasWidth, canvasHeight);
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Позиция основного слоя (на переднем плане, сверху-слева)
  const mainX = config.padding;
  const mainY = config.padding;

  // 2. Нарисовать задние слои (от самого дальнего к ближнему)
  for (let i = numLayers - 1; i >= 1; i--) {
    const layerIndex = i; // 1, 2, 3...

    // Каждый задний слой:
    // - Смещён вправо-вниз от основного
    // - Немного больше предыдущего (чтобы выглядывал)
    // - Более прозрачный

    const layerOffsetX = LAYER_OFFSET_X * layerIndex;
    const layerOffsetY = LAYER_OFFSET_Y * layerIndex;
    const layerScale = 1 + (LAYER_SCALE_STEP * layerIndex); // Увеличиваем размер

    const layerWidth = originalImage.width * layerScale;
    const layerHeight = originalImage.height * layerScale;

    // Позиция слоя (выглядывает справа-снизу)
    const layerX = mainX + layerOffsetX - (layerWidth - originalImage.width) / 2;
    const layerY = mainY + layerOffsetY - (layerHeight - originalImage.height) / 2;

    // Прозрачность: чем дальше слой, тем прозрачнее
    const opacity = 0.15 + (0.15 * (1 - layerIndex / numLayers)); // От 0.15 до 0.3

    ctx.save();
    ctx.globalAlpha = opacity;

    // Нарисовать тень для слоя
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';

    // Фон слоя (белый)
    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, layerX, layerY, layerWidth, layerHeight, mainLayerRadius * layerScale);
    ctx.fill();

    ctx.restore();
  }

  // 3. Нарисовать основной слой (100% непрозрачный, на переднем плане)
  ctx.save();
  ctx.globalAlpha = 1.0;

  // Мягкая тень для основного слоя
  ctx.shadowBlur = config.shadow.blur;
  ctx.shadowOffsetX = config.shadow.offsetX;
  ctx.shadowOffsetY = config.shadow.offsetY;
  ctx.shadowColor = config.shadow.color;

  // Фон основного слоя (белый)
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, mainX, mainY, originalImage.width, originalImage.height, mainLayerRadius);
  ctx.fill();

  // Сбросить тень перед рисованием изображения
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Обрезать углы для изображения
  drawRoundedRect(ctx, mainX, mainY, originalImage.width, originalImage.height, mainLayerRadius);
  ctx.clip();

  // Нарисовать само изображение
  ctx.drawImage(originalImage, mainX, mainY);

  ctx.restore();

  // 4. Добавить тонкую обводку основному слою для чёткости
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, mainX, mainY, originalImage.width, originalImage.height, mainLayerRadius);
  ctx.stroke();
  ctx.restore();

  return canvas.toBuffer('image/png');
}

module.exports = { apply };
