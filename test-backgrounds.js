/**
 * Тестирование генераторов фонов
 *
 * Запуск: node test-backgrounds.js
 * После успешного теста: rm test-backgrounds.js
 */

const { createBackground } = require('./src/services/backgrounds/backgroundFactory');
const { getAllGradientPresets, getAllSolidPresets } = require('./src/config/presets');
const fs = require('fs');
const path = require('path');

async function testBackgrounds() {
  console.log('🧪 Тестирование генераторов фонов...\n');

  const testOutputDir = './test-output';

  try {
    // Создать папку для тестовых файлов
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir);
    }

    // Тест 1: Gradient Background (линейный)
    console.log('Тест 1: Gradient Background (линейный градиент)...');
    const gradient = await createBackground('gradient', 500, 500, {
      colors: ['#FF6B6B', '#4ECDC4'],
      angle: 135,
      type: 'linear'
    });
    fs.writeFileSync(path.join(testOutputDir, 'test-gradient-linear.png'), gradient);
    console.log(`✅ Тест 1 пройден: ${gradient.length} байт (test-output/test-gradient-linear.png)\n`);

    // Тест 2: Gradient Background (радиальный)
    console.log('Тест 2: Gradient Background (радиальный градиент)...');
    const radialGradient = await createBackground('gradient', 500, 500, {
      colors: ['#FF6B6B', '#FFFF00', '#4ECDC4'],
      type: 'radial'
    });
    fs.writeFileSync(path.join(testOutputDir, 'test-gradient-radial.png'), radialGradient);
    console.log(`✅ Тест 2 пройден: ${radialGradient.length} байт (test-output/test-gradient-radial.png)\n`);

    // Тест 3: Solid Background
    console.log('Тест 3: Solid Background (однотонный)...');
    const solid = await createBackground('solid', 500, 500, {
      color: '#3498DB'
    });
    fs.writeFileSync(path.join(testOutputDir, 'test-solid.png'), solid);
    console.log(`✅ Тест 3 пройден: ${solid.length} байт (test-output/test-solid.png)\n`);

    // Тест 4: Blur Background
    console.log('Тест 4: Blur Background (размытие)...');
    const testImage = await createBackground('solid', 800, 600, { color: '#FF0000' });
    const blurred = await createBackground('blur', 500, 500, {
      sourceImage: testImage,
      blurAmount: 60,
      brightness: -0.2,
      saturation: 1.2
    });
    fs.writeFileSync(path.join(testOutputDir, 'test-blur.png'), blurred);
    console.log(`✅ Тест 4 пройден: ${blurred.length} байт (test-output/test-blur.png)\n`);

    // Тест 5: Gradient Presets
    console.log('Тест 5: Gradient Presets (готовые палитры)...');
    const gradients = getAllGradientPresets();
    console.log(`✅ Найдено ${gradients.length} preset градиентов:`);
    gradients.forEach(g => console.log(`   - ${g.name} (${g.slug})`));

    // Генерируем первый preset для проверки
    const firstGradient = gradients[0];
    const presetGradient = await createBackground(
      firstGradient.type,
      500,
      500,
      firstGradient.config
    );
    fs.writeFileSync(path.join(testOutputDir, `test-preset-${firstGradient.slug}.png`), presetGradient);
    console.log(`   ✅ Сгенерирован пример: ${firstGradient.name}\n`);

    // Тест 6: Solid Presets
    console.log('Тест 6: Solid Presets (готовые цвета)...');
    const solids = getAllSolidPresets();
    console.log(`✅ Найдено ${solids.length} preset цветов:`);
    solids.forEach(s => console.log(`   - ${s.name} (${s.slug})`));

    // Генерируем первый preset для проверки
    const firstSolid = solids[0];
    const presetSolid = await createBackground(
      firstSolid.type,
      500,
      500,
      firstSolid.config
    );
    fs.writeFileSync(path.join(testOutputDir, `test-preset-${firstSolid.slug}.png`), presetSolid);
    console.log(`   ✅ Сгенерирован пример: ${firstSolid.name}\n`);

    // Тест 7: Мультиградиент (4 цвета)
    console.log('Тест 7: Мультиградиент (4 цвета)...');
    const multiGradient = await createBackground('gradient', 500, 500, {
      colors: ['#FF6B6B', '#FFA500', '#FFD700', '#4ECDC4'],
      angle: 45
    });
    fs.writeFileSync(path.join(testOutputDir, 'test-multi-gradient.png'), multiGradient);
    console.log(`✅ Тест 7 пройден: ${multiGradient.length} байт (test-output/test-multi-gradient.png)\n`);

    // Тест 8: Разные форматы hex (#RGB и #RRGGBB)
    console.log('Тест 8: Разные форматы hex цветов...');
    const shortHex = await createBackground('solid', 300, 300, { color: '#F00' }); // #RGB
    const longHex = await createBackground('solid', 300, 300, { color: '#FF0000' }); // #RRGGBB
    console.log(`✅ Тест 8 пройден: короткий hex ${shortHex.length} байт, длинный hex ${longHex.length} байт\n`);

    // Итоговый отчёт
    console.log('═══════════════════════════════════════');
    console.log('🎉 ВСЕ ТЕСТЫ ФОНОВ ПРОЙДЕНЫ УСПЕШНО!');
    console.log('═══════════════════════════════════════\n');
    console.log('✅ Gradient Background - работает (linear + radial)');
    console.log('✅ Solid Background - работает (#RGB и #RRGGBB)');
    console.log('✅ Blur Background - работает');
    console.log('✅ Background Factory - работает');
    console.log(`✅ Gradient Presets - ${gradients.length} штук`);
    console.log(`✅ Solid Presets - ${solids.length} штук`);
    console.log('\n📁 Созданы тестовые изображения в папке: test-output/');
    console.log('👀 Проверь их визуально, чтобы убедиться что всё красиво!');
    console.log('\n📝 Следующий шаг: Перейти к Этапу 2 (Миграция шаблонов)');
    console.log('🗑️  После проверки удали: rm -rf test-output/ test-backgrounds.js\n');

  } catch (error) {
    console.error('\n❌ ОШИБКА ТЕСТИРОВАНИЯ ФОНОВ:\n');
    console.error(error);
    console.error('\n🔧 Возможные причины:');
    console.error('   1. Sharp не работает: проверь Этап 0');
    console.error('   2. Отсутствуют файлы backgrounds/');
    console.error('   3. Отсутствует presets.js\n');
    process.exit(1);
  }
}

testBackgrounds();
