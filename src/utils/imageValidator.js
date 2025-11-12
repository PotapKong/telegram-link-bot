/**
 * Валидация изображений
 * Проверка размера, формата и разрешения для защиты от DoS атак
 */

const sharp = require('sharp');

// Константы для валидации
const LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_WIDTH: 3840, // 4K width
  MAX_HEIGHT: 2160, // 4K height
  MIN_WIDTH: 100,
  MIN_HEIGHT: 100,
  ALLOWED_FORMATS: ['jpeg', 'png', 'webp', 'jpg']
};

/**
 * Валидация изображения
 *
 * @param {Buffer} imageBuffer - Буфер изображения
 * @returns {Promise<Object>} Метаданные изображения
 * @throws {Error} Если изображение не прошло валидацию
 */
async function validateImage(imageBuffer) {
  // Проверка 1: Размер файла
  if (imageBuffer.length > LIMITS.MAX_FILE_SIZE) {
    const sizeMB = (imageBuffer.length / (1024 * 1024)).toFixed(2);
    throw new Error(`❌ Файл слишком большой (${sizeMB}MB). Максимальный размер: 10MB.`);
  }

  let metadata;
  try {
    // Получить метаданные изображения
    metadata = await sharp(imageBuffer).metadata();
  } catch {
    throw new Error(
      '❌ Не удалось прочитать изображение. Файл поврежден или имеет неподдерживаемый формат.'
    );
  }

  // Проверка 2: Формат файла
  if (!LIMITS.ALLOWED_FORMATS.includes(metadata.format)) {
    throw new Error(
      `❌ Неподдерживаемый формат: ${metadata.format}. Поддерживаются: JPEG, PNG, WebP.`
    );
  }

  // Проверка 3: Разрешение (максимум)
  if (metadata.width > LIMITS.MAX_WIDTH || metadata.height > LIMITS.MAX_HEIGHT) {
    throw new Error(
      `❌ Разрешение слишком большое (${metadata.width}x${metadata.height}). ` +
        `Максимум: ${LIMITS.MAX_WIDTH}x${LIMITS.MAX_HEIGHT} (4K).`
    );
  }

  // Проверка 4: Разрешение (минимум)
  if (metadata.width < LIMITS.MIN_WIDTH || metadata.height < LIMITS.MIN_HEIGHT) {
    throw new Error(
      `❌ Разрешение слишком маленькое (${metadata.width}x${metadata.height}). ` +
        `Минимум: ${LIMITS.MIN_WIDTH}x${LIMITS.MIN_HEIGHT}.`
    );
  }

  // Логирование успешной валидации
  console.log(
    `✅ Изображение валидно: ${metadata.format}, ${metadata.width}x${metadata.height}, ` +
      `${(imageBuffer.length / 1024).toFixed(0)}KB`
  );

  return metadata;
}

/**
 * Получить размер файла в человекочитаемом формате
 */
function getReadableFileSize(bytes) {
  if (bytes < 1024) {return `${bytes} B`;}
  if (bytes < 1024 * 1024) {return `${(bytes / 1024).toFixed(2)} KB`;}
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

module.exports = {
  validateImage,
  getReadableFileSize,
  LIMITS
};
