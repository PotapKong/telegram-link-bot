/**
 * Тестирование Sharp и SVG генератора
 *
 * Запуск: node test-sharp.js
 * После успешного теста: rm test-sharp.js
 */

const sharp = require('sharp');
const { createLinearGradient } = require('./src/utils/svgGenerator');

async function testSharp() {
  console.log('🧪 Тестирование Sharp и SVG генератора...\n');

  try {
    // Тест 1: Создать простое изображение
    console.log('Тест 1: Создание простого изображения...');
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

    console.log(`✅ Тест 1 пройден: Создано изображение ${buffer1.length} байт\n`);

    // Тест 2: SVG градиент
    console.log('Тест 2: SVG линейный градиент...');
    const svgBuffer = createLinearGradient(500, 500, ['#FF6B6B', '#4ECDC4'], 135);
    const buffer2 = await sharp(svgBuffer)
      .png()
      .toBuffer();

    console.log(`✅ Тест 2 пройден: SVG градиент сконвертирован в PNG ${buffer2.length} байт\n`);

    // Тест 3: Composite (наложение слоёв)
    console.log('Тест 3: Composite - наложение слоёв...');
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

    console.log(`✅ Тест 3 пройден: Composite создан ${composite.length} байт\n`);

    // Тест 4: Gaussian Blur
    console.log('Тест 4: Gaussian Blur...');
    const blurred = await sharp(buffer1)
      .blur(20)
      .toBuffer();

    console.log(`✅ Тест 4 пройден: Blur применён ${blurred.length} байт\n`);

    // Тест 5: Resize с разными режимами
    console.log('Тест 5: Resize с режимом cover...');
    const resized = await sharp(buffer2)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .toBuffer();

    console.log(`✅ Тест 5 пройден: Resize выполнен ${resized.length} байт\n`);

    // Тест 6: Мультиградиент (3+ цвета)
    console.log('Тест 6: Градиент с 4 цветами...');
    const multiGradient = createLinearGradient(
      500,
      500,
      ['#FF6B6B', '#FFA500', '#FFD700', '#4ECDC4'],
      45
    );
    const buffer6 = await sharp(multiGradient)
      .png()
      .toBuffer();

    console.log(`✅ Тест 6 пройден: Мультиградиент создан ${buffer6.length} байт\n`);

    console.log('═══════════════════════════════════════');
    console.log('🎉 ВСЕ ТЕСТЫ SHARP ПРОЙДЕНЫ УСПЕШНО!');
    console.log('═══════════════════════════════════════\n');
    console.log('✅ Sharp установлен и работает корректно');
    console.log('✅ SVG Generator функционирует правильно');
    console.log('✅ Composite, Blur, Resize - всё работает');
    console.log('\n📝 Следующий шаг: Перейти к Этапу 1 (Архитектура фонов)');
    console.log('🗑️  Можно удалить этот файл: rm test-sharp.js\n');

  } catch (error) {
    console.error('\n❌ ОШИБКА ТЕСТИРОВАНИЯ SHARP:\n');
    console.error(error);
    console.error('\n🔧 Возможные причины:');
    console.error('   1. Sharp не установлен: npm install sharp');
    console.error('   2. Отсутствует libvips: apk add vips-dev fftw-dev');
    console.error('   3. Docker образ не пересобран: docker compose build\n');
    process.exit(1);
  }
}

testSharp();
