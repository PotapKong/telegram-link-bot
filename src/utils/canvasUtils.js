/**
 * Утилиты для работы с Canvas
 */

/**
 * Применить градиент к контексту
 */
function applyGradient(ctx, gradient, width, height) {
  const grad = ctx.createLinearGradient(
    0, 0,
    width * Math.cos(gradient.angle * Math.PI / 180),
    height * Math.sin(gradient.angle * Math.PI / 180)
  );

  gradient.colors.forEach((color, index) => {
    const stop = index / (gradient.colors.length - 1);
    grad.addColorStop(stop, color);
  });

  return grad;
}

/**
 * Нарисовать скруглённый прямоугольник
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

module.exports = {
  applyGradient,
  drawRoundedRect
};
