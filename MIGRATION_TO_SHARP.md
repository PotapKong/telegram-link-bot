# 🚀 Миграция с Canvas на Sharp

## 📋 Оглавление

1. [Почему Sharp](#-почему-sharp)
2. [Общий чек-лист](#-общий-чек-лист-миграции)
3. [Этап 0: Подготовка](#этап-0-подготовка)
4. [Этап 1: Архитектура фонов](#этап-1-архитектура-фонов)
5. [Этап 2: Миграция шаблонов](#этап-2-миграция-шаблонов)
6. [Этап 3: Генератор предпросмотра](#этап-3-генератор-предпросмотра)
7. [Этап 4: Новый UX Flow](#этап-4-новый-ux-flow)
8. [Этап 5: Тестирование](#этап-5-тестирование)
9. [Справочник API](#-справочник-api-sharp-vs-canvas)
10. [Troubleshooting](#-troubleshooting)

---

## 🎯 Почему Sharp?

### Преимущества Sharp над Canvas:

| Критерий | Canvas (node-canvas) | Sharp |
|----------|---------------------|-------|
| **Скорость** | ~500-1000ms | ~100-200ms |
| **Зависимости** | cairo, pango, jpeg, giflib | libvips (одна) |
| **Blur качество** | Среднее | Отличное (gaussian) |
| **Размер Docker** | ~200MB зависимостей | ~50MB |
| **Composite** | Сложно | Нативная поддержка |
| **SVG** | Нет | Да |
| **Memory** | Больше | Меньше (stream-based) |

### Что мы получим:

- ✅ **4-10x быстрее** обработка
- ✅ **Качественный blur** для фонов
- ✅ **SVG градиенты** (бесконечное разрешение)
- ✅ **Легче Docker образ** (~150MB экономии)
- ✅ **Лучший composite** для наложения слоёв
- ✅ **Меньше багов** с зависимостями

---

## ✅ Общий чек-лист миграции

### Этап 0: Подготовка (1-2 часа)
- [ ] 0.1 Установить `sharp` в package.json
- [ ] 0.2 Обновить Dockerfile (заменить зависимости)
- [ ] 0.3 Пересобрать Docker образ
- [ ] 0.4 Создать `src/utils/svgGenerator.js`
- [ ] 0.5 Протестировать базовую работу Sharp
- [ ] 0.6 Закоммитить изменения

### Этап 1: Архитектура фонов (3-4 часа)
- [ ] 1.1 Создать `src/services/backgrounds/gradientBackground.js`
- [ ] 1.2 Создать `src/services/backgrounds/solidBackground.js`
- [ ] 1.3 Создать `src/services/backgrounds/blurBackground.js`
- [ ] 1.4 Создать `src/services/backgrounds/backgroundFactory.js`
- [ ] 1.5 Создать preset палитры в `src/config/presets.js`
- [ ] 1.6 Написать юнит-тесты для фонов
- [ ] 1.7 Закоммитить изменения

### Этап 2: Миграция шаблонов (4-5 часов)
- [ ] 2.1 Переписать `src/services/templates/macWindow.js` на Sharp
- [ ] 2.2 Переписать `src/services/templates/iphone.js` на Sharp
- [ ] 2.3 Переписать `src/services/templates/layered.js` на Sharp
- [ ] 2.4 Обновить `src/services/imageProcessor.js`
- [ ] 2.5 Удалить `src/utils/canvasUtils.js` (больше не нужен)
- [ ] 2.6 Удалить зависимость `canvas` из package.json
- [ ] 2.7 Протестировать все шаблоны
- [ ] 2.8 Закоммитить изменения

### Этап 3: Генератор предпросмотра (2-3 часа)
- [ ] 3.1 Создать `src/services/previewGenerator.js`
- [ ] 3.2 Добавить генерацию превью для gradients
- [ ] 3.3 Добавить генерацию превью для solid colors
- [ ] 3.4 Добавить превью для blur эффекта
- [ ] 3.5 Протестировать все типы превью
- [ ] 3.6 Закоммитить изменения

### Этап 4: Новый UX Flow (4-5 часов)
- [ ] 4.1 Добавить `handleBackgroundTypeSelection()` в screenshot.js
- [ ] 4.2 Добавить `handleBackgroundVariantSelection()` в screenshot.js
- [ ] 4.3 Добавить `handlePreviewConfirmation()` в screenshot.js
- [ ] 4.4 Создать новые keyboards в `utils/keyboards.js`
- [ ] 4.5 Обновить stateManager для новых этапов
- [ ] 4.6 Реализовать RGB picker
- [ ] 4.7 Обновить базу данных (миграция таблиц)
- [ ] 4.8 Протестировать весь flow
- [ ] 4.9 Закоммитить изменения

### Этап 5: Тестирование (2-3 часа)
- [ ] 5.1 Протестировать все комбинации шаблон×фон
- [ ] 5.2 Проверить производительность (< 5 сек)
- [ ] 5.3 Проверить обработку ошибок
- [ ] 5.4 Проверить память (нет утечек)
- [ ] 5.5 Обновить README.md
- [ ] 5.6 Обновить DATABASE_SETUP.md
- [ ] 5.7 Создать CHANGELOG.md
- [ ] 5.8 Финальный коммит

---

## Этап 0: Подготовка

### 0.1 Установить Sharp

**Файл:** `package.json`

```json
{
  "dependencies": {
    "node-telegram-bot-api": "^0.61.0",
    "pg": "^8.11.3",
    "sharp": "^0.33.0",
    "axios": "^1.6.2"
  }
}
```

**Команда:**
```bash
npm install sharp@^0.33.0
```

**✅ Критерий выполнения:** `sharp` появился в package.json и node_modules

---

### 0.2 Обновить Dockerfile

**Файл:** `Dockerfile`

**Старая версия (Canvas):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Зависимости для Canvas
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["npm", "start"]
```

**Новая версия (Sharp):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Зависимости для Sharp (только libvips)
RUN apk add --no-cache \
    vips-dev \
    fftw-dev \
    build-base \
    python3

COPY package*.json ./
RUN npm install --production

# Удалить build зависимости после установки
RUN apk del build-base python3

COPY . .

CMD ["npm", "start"]
```

**Изменения:**
- ❌ Удалены: cairo, pango, jpeg-dev, giflib, pixman, pangomm, libjpeg-turbo, freetype
- ✅ Добавлены: vips-dev, fftw-dev (только эти две!)
- ✅ Удаляем build-base после установки (экономия места)

**✅ Критерий выполнения:** Dockerfile обновлён, размер образа уменьшился

---

### 0.3 Пересобрать Docker образ

**Команды на локальной машине:**
```bash
# Пересобрать образ
docker compose build --no-cache

# Запустить локально для теста
docker compose up -d

# Проверить логи
docker compose logs -f telegram-link-bot
```

**Что должно работать:**
- ✅ Sharp импортируется без ошибок
- ✅ Canvas больше не используется
- ✅ Бот запускается успешно

**✅ Критерий выполнения:** Образ собрался без ошибок, бот запустился

---

### 0.4 Создать SVG Generator

**Файл:** `src/utils/svgGenerator.js`

```javascript
/**
 * Генератор SVG для градиентов (используется Sharp)
 */

/**
 * Создать SVG с линейным градиентом
 *
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {string[]} colors - Массив hex-цветов (минимум 2)
 * @param {number} angle - Угол градиента в градусах (0-360)
 * @returns {Buffer} SVG буфер
 */
function createLinearGradient(width, height, colors, angle = 135) {
  // Преобразовать угол в координаты для SVG
  const angleRad = (angle - 90) * Math.PI / 180;
  const x1 = Math.round(50 + Math.cos(angleRad) * 50);
  const y1 = Math.round(50 + Math.sin(angleRad) * 50);
  const x2 = Math.round(50 + Math.cos(angleRad + Math.PI) * 50);
  const y2 = Math.round(50 + Math.sin(angleRad + Math.PI) * 50);

  // Создать stops для градиента
  const stops = colors.map((color, index) => {
    const offset = (index / (colors.length - 1)) * 100;
    return `<stop offset="${offset}%" stop-color="${color}" />`;
  }).join('\n    ');

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          ${stops}
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
    </svg>
  `;

  return Buffer.from(svg.trim());
}

/**
 * Создать SVG с радиальным градиентом
 *
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {string[]} colors - Массив hex-цветов
 * @param {number} cx - Центр X в процентах (0-100)
 * @param {number} cy - Центр Y в процентах (0-100)
 * @returns {Buffer} SVG буфер
 */
function createRadialGradient(width, height, colors, cx = 50, cy = 50) {
  const stops = colors.map((color, index) => {
    const offset = (index / (colors.length - 1)) * 100;
    return `<stop offset="${offset}%" stop-color="${color}" />`;
  }).join('\n    ');

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad" cx="${cx}%" cy="${cy}%">
          ${stops}
        </radialGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
    </svg>
  `;

  return Buffer.from(svg.trim());
}

/**
 * Создать однотонный SVG прямоугольник
 *
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {string} color - Hex цвет
 * @returns {Buffer} SVG буфер
 */
function createSolidColor(width, height, color) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}" />
    </svg>
  `;

  return Buffer.from(svg.trim());
}

module.exports = {
  createLinearGradient,
  createRadialGradient,
  createSolidColor
};
```

**✅ Критерий выполнения:** Файл создан, функции работают

---

### 0.5 Протестировать Sharp

**Файл:** `test-sharp.js` (временный, для теста)

```javascript
const sharp = require('sharp');
const { createLinearGradient } = require('./src/utils/svgGenerator');

async function testSharp() {
  console.log('🧪 Тестирование Sharp...');

  try {
    // Тест 1: Создать простое изображение
    const buffer1 = await sharp({
      create: {
        width: 500,
        height: 500,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 }
      }
    })
    .png()
    .toBuffer();

    console.log('✅ Тест 1: Создание изображения - OK');

    // Тест 2: SVG градиент
    const svgBuffer = createLinearGradient(500, 500, ['#FF6B6B', '#4ECDC4'], 135);
    const buffer2 = await sharp(svgBuffer)
      .png()
      .toBuffer();

    console.log('✅ Тест 2: SVG градиент - OK');

    // Тест 3: Composite (наложение)
    const redSquare = await sharp({
      create: { width: 200, height: 200, channels: 4, background: '#FF0000' }
    }).png().toBuffer();

    const blueSquare = await sharp({
      create: { width: 200, height: 200, channels: 4, background: '#0000FF' }
    }).png().toBuffer();

    const composite = await sharp(redSquare)
      .composite([
        { input: blueSquare, top: 50, left: 50 }
      ])
      .png()
      .toBuffer();

    console.log('✅ Тест 3: Composite - OK');

    // Тест 4: Blur
    const blurred = await sharp(buffer1)
      .blur(20)
      .toBuffer();

    console.log('✅ Тест 4: Gaussian blur - OK');

    console.log('\n🎉 Все тесты Sharp пройдены успешно!');

  } catch (error) {
    console.error('❌ Ошибка тестирования Sharp:', error);
    process.exit(1);
  }
}

testSharp();
```

**Команда:**
```bash
node test-sharp.js
```

**Ожидаемый результат:**
```
🧪 Тестирование Sharp...
✅ Тест 1: Создание изображения - OK
✅ Тест 2: SVG градиент - OK
✅ Тест 3: Composite - OK
✅ Тест 4: Gaussian blur - OK

🎉 Все тесты Sharp пройдены успешно!
```

**После теста:**
```bash
rm test-sharp.js  # Удалить тестовый файл
```

**✅ Критерий выполнения:** Все 4 теста прошли успешно

---

### 0.6 Закоммитить изменения

**Команды:**
```bash
git add package.json package-lock.json Dockerfile src/utils/svgGenerator.js
git commit -m "Этап 0: Подготовка к миграции на Sharp

- Установлен sharp@^0.33.0
- Обновлен Dockerfile (libvips вместо cairo/pango)
- Создан svgGenerator.js для SVG градиентов
- Протестирована базовая работа Sharp

Canvas пока оставлен для обратной совместимости."

git push origin feature/screenshot-background-selection
```

**✅ Критерий выполнения:** Коммит создан и запушен на GitHub

---

## Этап 1: Архитектура фонов

### 1.1 Gradient Background

**Файл:** `src/services/backgrounds/gradientBackground.js`

```javascript
/**
 * Генератор градиентных фонов
 */

const sharp = require('sharp');
const { createLinearGradient } = require('../../utils/svgGenerator');

/**
 * Создать градиентный фон
 *
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {Object} config - Конфигурация градиента
 * @param {string[]} config.colors - Массив hex-цветов
 * @param {number} config.angle - Угол градиента (0-360)
 * @param {string} config.type - Тип: 'linear' или 'radial'
 * @returns {Promise<Buffer>} PNG буфер
 */
async function generate(width, height, config) {
  const {
    colors = ['#FF6B6B', '#4ECDC4'],
    angle = 135,
    type = 'linear'
  } = config;

  // Создать SVG градиент
  const svgBuffer = createLinearGradient(width, height, colors, angle);

  // Конвертировать в PNG через Sharp
  return await sharp(svgBuffer)
    .png()
    .toBuffer();
}

module.exports = {
  generate
};
```

**✅ Критерий выполнения:** Файл создан, функция работает

---

### 1.2 Solid Background

**Файл:** `src/services/backgrounds/solidBackground.js`

```javascript
/**
 * Генератор однотонных фонов
 */

const sharp = require('sharp');

/**
 * Создать однотонный фон
 *
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {Object} config - Конфигурация цвета
 * @param {string} config.color - Hex цвет (#RRGGBB)
 * @returns {Promise<Buffer>} PNG буфер
 */
async function generate(width, height, config) {
  const { color = '#3498DB' } = config;

  // Парсинг hex цвета
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r, g, b, alpha: 1 }
    }
  })
  .png()
  .toBuffer();
}

module.exports = {
  generate
};
```

**✅ Критерий выполнения:** Файл создан, функция работает

---

### 1.3 Blur Background

**Файл:** `src/services/backgrounds/blurBackground.js`

```javascript
/**
 * Генератор размытых фонов из исходного изображения
 */

const sharp = require('sharp');

/**
 * Создать размытый фон из исходного изображения
 *
 * @param {number} width - Ширина итогового фона
 * @param {number} height - Высота итогового фона
 * @param {Object} config - Конфигурация
 * @param {Buffer} config.sourceImage - Исходное изображение
 * @param {number} config.blurAmount - Сила размытия (1-1000, рекомендуется 60-80)
 * @param {number} config.brightness - Яркость (-1 до 1, по умолчанию 0)
 * @param {number} config.saturation - Насыщенность (0-2, по умолчанию 1)
 * @returns {Promise<Buffer>} PNG буфер
 */
async function generate(width, height, config) {
  const {
    sourceImage,
    blurAmount = 70,
    brightness = -0.2,  // Немного затемняем
    saturation = 1.2    // Немного повышаем насыщенность
  } = config;

  if (!sourceImage) {
    throw new Error('Blur background требует исходное изображение (sourceImage)');
  }

  // Масштабировать исходное изображение до размера фона (cover)
  const resized = await sharp(sourceImage)
    .resize(width, height, {
      fit: 'cover',
      position: 'center'
    })
    .toBuffer();

  // Применить blur и эффекты
  return await sharp(resized)
    .blur(blurAmount)
    .modulate({
      brightness: 1 + brightness,  // Sharp использует множитель (1 = без изменений)
      saturation: saturation
    })
    .png()
    .toBuffer();
}

module.exports = {
  generate
};
```

**✅ Критерий выполнения:** Файл создан, функция работает с blur

---

### 1.4 Background Factory

**Файл:** `src/services/backgrounds/backgroundFactory.js`

```javascript
/**
 * Фабрика для создания фонов разных типов
 */

const gradientBackground = require('./gradientBackground');
const solidBackground = require('./solidBackground');
const blurBackground = require('./blurBackground');

/**
 * Создать фон по типу
 *
 * @param {string} type - Тип фона: 'gradient', 'solid', 'blur'
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {Object} config - Конфигурация (зависит от типа)
 * @returns {Promise<Buffer>} PNG буфер фона
 */
async function createBackground(type, width, height, config) {
  switch (type) {
    case 'gradient':
      return await gradientBackground.generate(width, height, config);

    case 'solid':
      return await solidBackground.generate(width, height, config);

    case 'blur':
      return await blurBackground.generate(width, height, config);

    default:
      throw new Error(`Неизвестный тип фона: ${type}`);
  }
}

module.exports = {
  createBackground
};
```

**✅ Критерий выполнения:** Файл создан, фабрика работает для всех типов

---

### 1.5 Preset палитры

**Файл:** `src/config/presets.js`

```javascript
/**
 * Preset конфигурации для фонов
 */

/**
 * Preset градиенты
 */
const GRADIENT_PRESETS = {
  tropics: {
    name: '🌴 Тропики',
    slug: 'tropics',
    type: 'gradient',
    config: {
      colors: ['#43E97B', '#38F9D7'],
      angle: 135
    }
  },
  violet: {
    name: '💜 Фиалка',
    slug: 'violet',
    type: 'gradient',
    config: {
      colors: ['#7F00FF', '#E100FF'],
      angle: 135
    }
  },
  peach: {
    name: '🍑 Персик',
    slug: 'peach',
    type: 'gradient',
    config: {
      colors: ['#FFE259', '#FFA751'],
      angle: 135
    }
  },
  telegram: {
    name: '📱 Telegram',
    slug: 'telegram',
    type: 'gradient',
    config: {
      colors: ['#54A9EB', '#006FC8'],
      angle: 135
    }
  },
  sunset: {
    name: '🌅 Закат',
    slug: 'sunset',
    type: 'gradient',
    config: {
      colors: ['#FF512F', '#DD2476'],
      angle: 135
    }
  },
  ocean: {
    name: '🌊 Океан',
    slug: 'ocean',
    type: 'gradient',
    config: {
      colors: ['#2E3192', '#1BFFFF'],
      angle: 135
    }
  },
  fire: {
    name: '🔥 Огонь',
    slug: 'fire',
    type: 'gradient',
    config: {
      colors: ['#F12711', '#F5AF19'],
      angle: 45
    }
  },
  mint: {
    name: '🌿 Мята',
    slug: 'mint',
    type: 'gradient',
    config: {
      colors: ['#00F260', '#0575E6'],
      angle: 135
    }
  }
};

/**
 * Preset однотонные цвета
 */
const SOLID_PRESETS = {
  telegram_blue: {
    name: '📱 Telegram',
    slug: 'telegram_blue',
    type: 'solid',
    config: {
      color: '#54A9EB'
    }
  },
  peach: {
    name: '🍑 Персик',
    slug: 'peach',
    type: 'solid',
    config: {
      color: '#FFB399'
    }
  },
  lavender: {
    name: '💜 Лаванда',
    slug: 'lavender',
    type: 'solid',
    config: {
      color: '#B19CD9'
    }
  },
  mint: {
    name: '🌿 Мята',
    slug: 'mint',
    type: 'solid',
    config: {
      color: '#77DD77'
    }
  },
  coral: {
    name: '🪸 Коралл',
    slug: 'coral',
    type: 'solid',
    config: {
      color: '#FF6B6B'
    }
  },
  sky: {
    name: '☁️ Небо',
    slug: 'sky',
    type: 'solid',
    config: {
      color: '#AEC6CF'
    }
  }
};

/**
 * Получить все preset градиенты
 */
function getAllGradientPresets() {
  return Object.values(GRADIENT_PRESETS);
}

/**
 * Получить все preset цвета
 */
function getAllSolidPresets() {
  return Object.values(SOLID_PRESETS);
}

/**
 * Получить preset по slug
 */
function getPresetBySlug(slug) {
  return GRADIENT_PRESETS[slug] || SOLID_PRESETS[slug] || null;
}

module.exports = {
  GRADIENT_PRESETS,
  SOLID_PRESETS,
  getAllGradientPresets,
  getAllSolidPresets,
  getPresetBySlug
};
```

**✅ Критерий выполнения:** Файл создан, 8 градиентов и 6 цветов доступны

---

### 1.6 Юнит-тесты для фонов

**Файл:** `test-backgrounds.js` (временный)

```javascript
const { createBackground } = require('./src/services/backgrounds/backgroundFactory');
const { getAllGradientPresets, getAllSolidPresets } = require('./src/config/presets');
const fs = require('fs');

async function testBackgrounds() {
  console.log('🧪 Тестирование генераторов фонов...\n');

  try {
    // Тест 1: Gradient
    console.log('Тест 1: Gradient Background');
    const gradient = await createBackground('gradient', 500, 500, {
      colors: ['#FF6B6B', '#4ECDC4'],
      angle: 135
    });
    fs.writeFileSync('test-gradient.png', gradient);
    console.log('✅ Gradient - OK (test-gradient.png)\n');

    // Тест 2: Solid
    console.log('Тест 2: Solid Background');
    const solid = await createBackground('solid', 500, 500, {
      color: '#3498DB'
    });
    fs.writeFileSync('test-solid.png', solid);
    console.log('✅ Solid - OK (test-solid.png)\n');

    // Тест 3: Blur (нужно тестовое изображение)
    console.log('Тест 3: Blur Background');
    const testImage = await createBackground('solid', 800, 600, { color: '#FF0000' });
    const blurred = await createBackground('blur', 500, 500, {
      sourceImage: testImage,
      blurAmount: 60
    });
    fs.writeFileSync('test-blur.png', blurred);
    console.log('✅ Blur - OK (test-blur.png)\n');

    // Тест 4: Все presets
    console.log('Тест 4: Gradient Presets');
    const gradients = getAllGradientPresets();
    console.log(`✅ Найдено ${gradients.length} градиентов`);
    gradients.forEach(g => console.log(`   - ${g.name} (${g.slug})`));

    console.log('\nТест 5: Solid Presets');
    const solids = getAllSolidPresets();
    console.log(`✅ Найдено ${solids.length} цветов`);
    solids.forEach(s => console.log(`   - ${s.name} (${s.slug})`));

    console.log('\n🎉 Все тесты фонов пройдены успешно!');
    console.log('📁 Созданы тестовые изображения: test-gradient.png, test-solid.png, test-blur.png');
    console.log('🗑️  Удали их после проверки: rm test-*.png');

  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
}

testBackgrounds();
```

**Команда:**
```bash
node test-backgrounds.js
```

**✅ Критерий выполнения:** Все тесты прошли, созданы 3 PNG файла

---

### 1.7 Закоммитить

```bash
git add src/services/backgrounds/ src/config/presets.js
git commit -m "Этап 1: Архитектура фонов на Sharp

- Создан gradientBackground.js (SVG градиенты)
- Создан solidBackground.js (однотонные цвета)
- Создан blurBackground.js (размытие исходника)
- Создан backgroundFactory.js (фабрика)
- Добавлены 8 gradient presets и 6 solid presets
- Все тесты пройдены успешно"

git push origin feature/screenshot-background-selection
```

**✅ Этап 1 завершён!** Время: ~3-4 часа

---

## Этап 2: Миграция шаблонов

### 2.1 Переписать Mac Window на Sharp

**Файл:** `src/services/templates/macWindow.js`

**Концепция Sharp-версии:**
1. Создать фон через backgroundFactory
2. Создать window mockup отдельно
3. Composite: фон + тень + window + screenshot

**Новый код:**

```javascript
/**
 * Mac Window шаблон (Sharp версия)
 */

const sharp = require('sharp');
const { createBackground } = require('../backgrounds/backgroundFactory');

/**
 * Применить Mac Window шаблон
 *
 * @param {Buffer} imageBuffer - Исходное изображение
 * @param {Object} backgroundConfig - Конфигурация фона
 * @param {Object} config - Общие настройки
 * @returns {Promise<Buffer>} Обработанное изображение
 */
async function apply(imageBuffer, backgroundConfig, config) {
  const TITLE_BAR_HEIGHT = 52;
  const WINDOW_PADDING = 24;
  const WINDOW_RADIUS = 20;
  const PADDING = config.padding || 60;

  // 1. Получить размеры исходного изображения
  const imageMetadata = await sharp(imageBuffer).metadata();
  const imageWidth = imageMetadata.width;
  const imageHeight = imageMetadata.height;

  // 2. Размеры окна
  const windowWidth = imageWidth + (WINDOW_PADDING * 2);
  const windowHeight = imageHeight + TITLE_BAR_HEIGHT + (WINDOW_PADDING * 2);

  // 3. Размеры холста
  const canvasWidth = windowWidth + (PADDING * 2);
  const canvasHeight = windowHeight + (PADDING * 2);

  // 4. Создать фон
  const background = await createBackground(
    backgroundConfig.type,
    canvasWidth,
    canvasHeight,
    backgroundConfig.config
  );

  // 5. Создать SVG окна с тенью
  const windowSvg = `
    <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
      <!-- Тень окна -->
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="${config.shadow?.blur || 30}"/>
          <feOffset dx="${config.shadow?.offsetX || 0}" dy="${config.shadow?.offsetY || 10}" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.25"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Фон окна -->
      <rect
        x="${PADDING}"
        y="${PADDING}"
        width="${windowWidth}"
        height="${windowHeight}"
        rx="${WINDOW_RADIUS}"
        fill="#F6F6F6"
        filter="url(#shadow)"
      />

      <!-- Title bar -->
      <rect
        x="${PADDING}"
        y="${PADDING}"
        width="${windowWidth}"
        height="${TITLE_BAR_HEIGHT}"
        rx="${WINDOW_RADIUS}"
        fill="url(#titleGradient)"
      />
      <rect
        x="${PADDING}"
        y="${PADDING + TITLE_BAR_HEIGHT - WINDOW_RADIUS}"
        width="${windowWidth}"
        height="${WINDOW_RADIUS}"
        fill="#EBEBEB"
      />

      <defs>
        <linearGradient id="titleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#F0F0F0" />
          <stop offset="100%" stop-color="#E0E0E0" />
        </linearGradient>
      </defs>

      <!-- Кнопки -->
      <circle cx="${PADDING + 20}" cy="${PADDING + 26}" r="6" fill="#FF5F57"/>
      <circle cx="${PADDING + 40}" cy="${PADDING + 26}" r="6" fill="#FFBD2E"/>
      <circle cx="${PADDING + 60}" cy="${PADDING + 26}" r="6" fill="#28CA42"/>
    </svg>
  `;

  // 6. Позиция скриншота внутри окна
  const screenshotX = PADDING + WINDOW_PADDING;
  const screenshotY = PADDING + TITLE_BAR_HEIGHT + WINDOW_PADDING;

  // 7. Composite всех слоёв
  const result = await sharp(background)
    .composite([
      // Окно с тенью
      { input: Buffer.from(windowSvg), top: 0, left: 0 },
      // Скриншот
      { input: imageBuffer, top: screenshotY, left: screenshotX }
    ])
    .png()
    .toBuffer();

  return result;
}

module.exports = {
  apply
};
```

**✅ Критерий выполнения:** Mac Window работает на Sharp, выглядит лучше Canvas версии

---

### 2.2 Переписать iPhone на Sharp

**Файл:** `src/services/templates/iphone.js`

```javascript
/**
 * iPhone шаблон (Sharp версия)
 */

const sharp = require('sharp');
const { createBackground } = require('../backgrounds/backgroundFactory');

async function apply(imageBuffer, backgroundConfig, config) {
  const PHONE_ASPECT_RATIO = 2.16;
  const DEVICE_BEZEL = 16;
  const DEVICE_RADIUS = 60;
  const SCREEN_RADIUS = 52;
  const PADDING = config.padding || 80;

  // 1. Метаданные изображения
  const imageMetadata = await sharp(imageBuffer).metadata();

  // 2. Размеры телефона (фиксированная ширина для консистентности)
  const phoneWidth = 650;
  const phoneHeight = Math.round(phoneWidth * PHONE_ASPECT_RATIO);

  // 3. Размеры экрана
  const screenWidth = phoneWidth - (DEVICE_BEZEL * 2);
  const screenHeight = phoneHeight - (DEVICE_BEZEL * 2);

  // 4. Масштабировать изображение под экран
  const resizedImage = await sharp(imageBuffer)
    .resize(screenWidth, screenHeight, {
      fit: 'cover',
      position: 'center'
    })
    .toBuffer();

  // 5. Размеры холста
  const canvasWidth = phoneWidth + (PADDING * 2);
  const canvasHeight = phoneHeight + (PADDING * 2);

  // 6. Создать фон
  const background = await createBackground(
    backgroundConfig.type,
    canvasWidth,
    canvasHeight,
    backgroundConfig.config
  );

  // 7. SVG телефона
  const phoneSvg = `
    <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Тень -->
        <filter id="shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="${config.shadow?.blur || 40}"/>
          <feOffset dy="${config.shadow?.offsetY || 20}"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <!-- Градиент рамки (металл) -->
        <linearGradient id="bezelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1C1C1E" />
          <stop offset="50%" stop-color="#2C2C2E" />
          <stop offset="100%" stop-color="#1C1C1E" />
        </linearGradient>
      </defs>

      <!-- Корпус телефона -->
      <rect
        x="${PADDING}"
        y="${PADDING}"
        width="${phoneWidth}"
        height="${phoneHeight}"
        rx="${DEVICE_RADIUS}"
        fill="url(#bezelGrad)"
        filter="url(#shadow)"
      />

      <!-- Dynamic Island -->
      <ellipse
        cx="${PADDING + phoneWidth / 2}"
        cy="${PADDING + 40}"
        rx="50"
        ry="18"
        fill="#000000"
      />
    </svg>
  `;

  // 8. Позиция экрана
  const screenX = PADDING + DEVICE_BEZEL;
  const screenY = PADDING + DEVICE_BEZEL;

  // 9. Composite
  const result = await sharp(background)
    .composite([
      { input: Buffer.from(phoneSvg), top: 0, left: 0 },
      { input: resizedImage, top: screenY, left: screenX }
    ])
    .png()
    .toBuffer();

  return result;
}

module.exports = {
  apply
};
```

**✅ Критерий выполнения:** iPhone работает, реалистичный мокап

---

### 2.3 Переписать Layered на Sharp

**Файл:** `src/services/templates/layered.js`

```javascript
/**
 * Layered шаблон (Sharp версия)
 */

const sharp = require('sharp');
const { createBackground } = require('../backgrounds/backgroundFactory');

async function apply(imageBuffer, backgroundConfig, config) {
  const NUM_LAYERS = 3;
  const LAYER_OFFSET_X = 20;
  const LAYER_OFFSET_Y = 20;
  const LAYER_SCALE_STEP = 0.03;
  const PADDING = config.padding || 80;

  // 1. Метаданные
  const imageMetadata = await sharp(imageBuffer).metadata();
  const imgWidth = imageMetadata.width;
  const imgHeight = imageMetadata.height;

  // 2. Размеры главного слоя
  const mainLayerWidth = imgWidth;
  const mainLayerHeight = imgHeight;

  // 3. Размеры холста (с учётом отступов задних слоёв)
  const canvasWidth = mainLayerWidth + (LAYER_OFFSET_X * (NUM_LAYERS - 1)) + (PADDING * 2);
  const canvasHeight = mainLayerHeight + (LAYER_OFFSET_Y * (NUM_LAYERS - 1)) + (PADDING * 2);

  // 4. Создать фон
  const background = await createBackground(
    backgroundConfig.type,
    canvasWidth,
    canvasHeight,
    backgroundConfig.config
  );

  // 5. Создать задние слои (полупрозрачные белые прямоугольники)
  const layers = [];

  for (let i = NUM_LAYERS - 1; i >= 1; i--) {
    const layerScale = 1 + (LAYER_SCALE_STEP * i);
    const layerWidth = Math.round(mainLayerWidth * layerScale);
    const layerHeight = Math.round(mainLayerHeight * layerScale);
    const layerX = PADDING + (LAYER_OFFSET_X * i) - Math.round((layerWidth - mainLayerWidth) / 2);
    const layerY = PADDING + (LAYER_OFFSET_Y * i) - Math.round((layerHeight - mainLayerHeight) / 2);
    const opacity = 0.15 + (0.15 * (1 - i / NUM_LAYERS)); // 0.15 - 0.3

    // SVG для заднего слоя
    const layerSvg = `
      <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="${layerX}"
          y="${layerY}"
          width="${layerWidth}"
          height="${layerHeight}"
          rx="${config.radius || 12}"
          fill="rgba(255, 255, 255, ${opacity})"
        />
      </svg>
    `;

    layers.push({ input: Buffer.from(layerSvg), top: 0, left: 0 });
  }

  // 6. Главный слой (100% непрозрачный)
  const mainX = PADDING;
  const mainY = PADDING;
  layers.push({ input: imageBuffer, top: mainY, left: mainX });

  // 7. Composite
  const result = await sharp(background)
    .composite(layers)
    .png()
    .toBuffer();

  return result;
}

module.exports = {
  apply
};
```

**✅ Критерий выполнения:** Layered работает правильно, задние слои сзади

---

### 2.4 Обновить imageProcessor

**Файл:** `src/services/imageProcessor.js`

```javascript
/**
 * Сервис обработки изображений (Sharp версия)
 */

const macWindowTemplate = require('./templates/macWindow');
const iphoneTemplate = require('./templates/iphone');
const layeredTemplate = require('./templates/layered');

/**
 * Обработать скриншот
 *
 * @param {Buffer} imageBuffer - Буфер изображения
 * @param {Object} template - Объект шаблона
 * @param {Object} backgroundConfig - Конфигурация фона
 * @param {Object} settings - Настройки
 * @returns {Promise<{buffer: Buffer, processingTime: number}>}
 */
async function processScreenshot(imageBuffer, template, backgroundConfig, settings = {}) {
  const startTime = Date.now();

  const config = {
    radius: settings.radius !== undefined ? settings.radius : 12,
    shadow: {
      blur: settings.shadow?.blur || 30,
      offsetX: settings.shadow?.offsetX || 0,
      offsetY: settings.shadow?.offsetY || 10
    },
    padding: settings.padding || 60
  };

  try {
    let result;

    switch (template.type) {
      case 'mac-window':
        result = await macWindowTemplate.apply(imageBuffer, backgroundConfig, config);
        break;
      case 'iphone':
        result = await iphoneTemplate.apply(imageBuffer, backgroundConfig, config);
        break;
      case 'layered':
        result = await layeredTemplate.apply(imageBuffer, backgroundConfig, config);
        break;
      default:
        throw new Error(`Неизвестный тип шаблона: ${template.type}`);
    }

    const processingTime = Date.now() - startTime;
    console.log(`✅ Скриншот обработан за ${processingTime}ms с шаблоном ${template.slug}`);

    return {
      buffer: result,
      processingTime
    };

  } catch (error) {
    console.error('❌ Ошибка обработки изображения:', error);
    throw error;
  }
}

module.exports = {
  processScreenshot
};
```

**✅ Критерий выполнения:** imageProcessor работает с Sharp шаблонами

---

### 2.5-2.7 Удалить Canvas, тестировать, коммитить

```bash
# Удалить Canvas файлы
rm src/utils/canvasUtils.js

# Удалить canvas из package.json
npm uninstall canvas

# Протестировать все шаблоны (запустить бота и проверить)
docker compose build
docker compose up -d
docker compose logs -f telegram-link-bot

# После успешного теста - коммит
git add .
git commit -m "Этап 2: Миграция шаблонов на Sharp

- Переписан macWindow.js на Sharp + SVG
- Переписан iphone.js на Sharp + SVG
- Переписан layered.js на Sharp + SVG
- Обновлён imageProcessor.js
- Удалён canvas и canvasUtils.js
- Все шаблоны работают быстрее и качественнее"

git push origin feature/screenshot-background-selection
```

**✅ Этап 2 завершён!** Время: ~4-5 часов

---

## 📚 Справочник API: Sharp vs Canvas

### Создание изображения

**Canvas:**
```javascript
const { createCanvas } = require('canvas');
const canvas = createCanvas(500, 500);
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#FF0000';
ctx.fillRect(0, 0, 500, 500);
const buffer = canvas.toBuffer('image/png');
```

**Sharp:**
```javascript
const sharp = require('sharp');
const buffer = await sharp({
  create: {
    width: 500,
    height: 500,
    channels: 4,
    background: { r: 255, g: 0, b: 0, alpha: 1 }
  }
})
.png()
.toBuffer();
```

---

### Наложение слоёв (Composite)

**Canvas:**
```javascript
// Нужно вручную управлять позициями
ctx.drawImage(layer1, 0, 0);
ctx.drawImage(layer2, 50, 50);
```

**Sharp:**
```javascript
await sharp(background)
  .composite([
    { input: layer1, top: 0, left: 0 },
    { input: layer2, top: 50, left: 50 }
  ])
  .toBuffer();
```

---

### Blur

**Canvas:**
```javascript
// Нет встроенного blur, нужны workaround'ы
```

**Sharp:**
```javascript
await sharp(image)
  .blur(20)  // Gaussian blur
  .toBuffer();
```

---

### Градиенты

**Canvas:**
```javascript
const gradient = ctx.createLinearGradient(0, 0, 500, 500);
gradient.addColorStop(0, '#FF0000');
gradient.addColorStop(1, '#0000FF');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 500, 500);
```

**Sharp:**
```javascript
// Через SVG
const svg = `
  <svg width="500" height="500">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF0000" />
        <stop offset="100%" stop-color="#0000FF" />
      </linearGradient>
    </defs>
    <rect width="500" height="500" fill="url(#g)" />
  </svg>
`;
await sharp(Buffer.from(svg)).png().toBuffer();
```

---

### Resize

**Canvas:**
```javascript
ctx.drawImage(image, 0, 0, newWidth, newHeight);
```

**Sharp:**
```javascript
await sharp(image)
  .resize(newWidth, newHeight, {
    fit: 'cover', // cover, contain, fill, inside, outside
    position: 'center'
  })
  .toBuffer();
```

---

## 🔧 Troubleshooting

### Проблема: Sharp не устанавливается в Docker

**Причина:** Отсутствует libvips или build-base

**Решение:**
```dockerfile
RUN apk add --no-cache vips-dev fftw-dev build-base python3
RUN npm install
RUN apk del build-base python3  # Удалить после установки
```

---

### Проблема: SVG не рендерится

**Причина:** Некорректный SVG синтаксис

**Решение:** Проверить:
- Все атрибуты в кавычках
- Правильные единицы измерения (px, %, etc.)
- Namespace: `xmlns="http://www.w3.org/2000/svg"`

---

### Проблема: Composite не накладывает слой

**Причина:** Размеры слоя больше базового изображения

**Решение:**
```javascript
// Убедиться что top + height <= baseHeight
// И left + width <= baseWidth
```

---

### Проблема: Низкая производительность

**Причина:** Много промежуточных буферов

**Решение:** Использовать stream вместо toBuffer()
```javascript
await sharp(input)
  .composite([...])
  .png()
  .toFile('output.png');  // Быстрее чем toBuffer()
```

---

## 🎯 Следующие шаги

После завершения Этапа 2 переходи к:
- **Этап 3:** Генератор предпросмотра
- **Этап 4:** Новый UX Flow
- **Этап 5:** Тестирование

Каждый этап будем делать **последовательно**, отмечая в чек-листе!

---

## 📄 Полезные ссылки

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [SVG Spec](https://www.w3.org/TR/SVG2/)
- [libvips](https://www.libvips.org/)

---

**Дата создания:** 2025-11-03
**Версия:** 1.0
**Автор:** Claude + PotapKong
