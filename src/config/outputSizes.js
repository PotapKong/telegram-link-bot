/**
 * Константы размеров выходных изображений
 * Стандартные размеры для социальных сетей
 */

const OUTPUT_SIZES = {
  // Квадратный формат (Instagram пост, Facebook)
  square: {
    name: 'Квадрат 1:1',
    slug: 'square',
    width: 1080,
    height: 1080,
    aspectRatio: 1
  },

  // Вертикальный формат (Instagram Stories, Reels)
  portrait: {
    name: 'Вертикальный 9:16',
    slug: 'portrait',
    width: 1080,
    height: 1920,
    aspectRatio: 9 / 16
  },

  // Горизонтальный формат (YouTube, Twitter)
  landscape: {
    name: 'Горизонтальный 16:9',
    slug: 'landscape',
    width: 1920,
    height: 1080,
    aspectRatio: 16 / 9
  },

  // Автоматический (подстраивается под скриншот)
  auto: {
    name: 'Авто',
    slug: 'auto',
    width: null,  // Будет вычислено
    height: null,
    aspectRatio: null
  }
};

/**
 * Получить размер по slug
 *
 * @param {string} slug - Slug размера (square, portrait, landscape, auto)
 * @returns {Object} Объект с размерами
 */
function getOutputSize(slug) {
  return OUTPUT_SIZES[slug] || OUTPUT_SIZES.square;
}

/**
 * Получить все доступные размеры (кроме auto)
 *
 * @returns {Array<Object>} Массив размеров
 */
function getAllOutputSizes() {
  return [
    OUTPUT_SIZES.square,
    OUTPUT_SIZES.portrait,
    OUTPUT_SIZES.landscape
  ];
}

module.exports = {
  OUTPUT_SIZES,
  getOutputSize,
  getAllOutputSizes
};
