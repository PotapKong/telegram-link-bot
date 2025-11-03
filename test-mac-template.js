/**
 * Тестирование Mac Window шаблона на Sharp
 *
 * Запуск: node test-mac-template.js
 * После успешного теста: rm test-mac-template.js
 */

const sharp = require('sharp');
const macWindowTemplate = require('./src/services/templates/macWindow');
const { getAllGradientPresets } = require('./src/config/presets');
const fs = require('fs');
const path = require('path');

async function testMacTemplate() {
  console.log('🧪 Тестирование Mac Window шаблона (Sharp версия)...\n');

  const testOutputDir = './test-output';

  try {
    // Создать папку для тестовых файлов
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir);
    }

    // Создать тестовый скриншот (800x600, разноцветный)
    console.log('Создание тестового скриншота...');
    const testScreenshot = await sharp({
      create: {
        width: 800,
        height: 600,
        channels: 4,
        background: { r: 100, g: 150, b: 200, alpha: 1 }
      }
    })
    .composite([
      {
        input: Buffer.from(`
          <svg width="800" height="600">
            <text x="400" y="300" font-size="48" fill="white" text-anchor="middle" font-family="Arial">
              Test Screenshot
            </text>
            <text x="400" y="350" font-size="24" fill="rgba(255,255,255,0.7)" text-anchor="middle" font-family="Arial">
              Mac Window Template
            </text>
          </svg>
        `),
        top: 0,
        left: 0
      }
    ])
    .png()
    .toBuffer();

    console.log('✅ Тестовый скриншот создан\n');

    // Тест 1: Mac Window с gradient фоном (Telegram)
    console.log('Тест 1: Mac Window с gradient фоном (Telegram)...');
    const result1 = await macWindowTemplate.apply(
      testScreenshot,
      {
        type: 'gradient',
        config: {
          colors: ['#54A9EB', '#006FC8'],
          angle: 135
        }
      },
      {
        padding: 60,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10
        }
      },
      { windowButtons: true }
    );
    fs.writeFileSync(path.join(testOutputDir, 'mac-template-gradient.png'), result1);
    console.log(`✅ Тест 1 пройден: ${result1.length} байт (test-output/mac-template-gradient.png)\n`);

    // Тест 2: Mac Window с solid фоном
    console.log('Тест 2: Mac Window с solid фоном...');
    const result2 = await macWindowTemplate.apply(
      testScreenshot,
      {
        type: 'solid',
        config: {
          color: '#B19CD9'
        }
      },
      {
        padding: 60,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10
        }
      },
      { windowButtons: true }
    );
    fs.writeFileSync(path.join(testOutputDir, 'mac-template-solid.png'), result2);
    console.log(`✅ Тест 2 пройден: ${result2.length} байт (test-output/mac-template-solid.png)\n`);

    // Тест 3: Mac Window с blur фоном
    console.log('Тест 3: Mac Window с blur фоном...');
    const result3 = await macWindowTemplate.apply(
      testScreenshot,
      {
        type: 'blur',
        config: {
          sourceImage: testScreenshot,
          blurAmount: 70,
          brightness: -0.2,
          saturation: 1.2
        }
      },
      {
        padding: 60,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10
        }
      },
      { windowButtons: true }
    );
    fs.writeFileSync(path.join(testOutputDir, 'mac-template-blur.png'), result3);
    console.log(`✅ Тест 3 пройден: ${result3.length} байт (test-output/mac-template-blur.png)\n`);

    // Тест 4: Mac Window без кнопок
    console.log('Тест 4: Mac Window без кнопок...');
    const result4 = await macWindowTemplate.apply(
      testScreenshot,
      {
        type: 'gradient',
        config: {
          colors: ['#FF6B6B', '#4ECDC4'],
          angle: 45
        }
      },
      {
        padding: 60,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10
        }
      },
      { windowButtons: false }
    );
    fs.writeFileSync(path.join(testOutputDir, 'mac-template-no-buttons.png'), result4);
    console.log(`✅ Тест 4 пройден: ${result4.length} байт (test-output/mac-template-no-buttons.png)\n`);

    // Тест 5: Mac Window с preset градиентом (Тропики)
    console.log('Тест 5: Mac Window с preset градиентом (Тропики)...');
    const gradients = getAllGradientPresets();
    const tropicsPreset = gradients.find(g => g.slug === 'tropics');
    const result5 = await macWindowTemplate.apply(
      testScreenshot,
      tropicsPreset,
      {
        padding: 60,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10
        }
      },
      { windowButtons: true }
    );
    fs.writeFileSync(path.join(testOutputDir, 'mac-template-tropics.png'), result5);
    console.log(`✅ Тест 5 пройден: ${result5.length} байт (test-output/mac-template-tropics.png)\n`);

    // Тест 6: Mac Window с маленьким скриншотом
    console.log('Тест 6: Mac Window с маленьким скриншотом (400x300)...');
    const smallScreenshot = await sharp({
      create: {
        width: 400,
        height: 300,
        channels: 4,
        background: { r: 255, g: 100, b: 100, alpha: 1 }
      }
    })
    .png()
    .toBuffer();

    const result6 = await macWindowTemplate.apply(
      smallScreenshot,
      {
        type: 'gradient',
        config: {
          colors: ['#2E3192', '#1BFFFF'],
          angle: 135
        }
      },
      {
        padding: 60,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10
        }
      },
      { windowButtons: true }
    );
    fs.writeFileSync(path.join(testOutputDir, 'mac-template-small.png'), result6);
    console.log(`✅ Тест 6 пройден: ${result6.length} байт (test-output/mac-template-small.png)\n`);

    // Итоговый отчёт
    console.log('═══════════════════════════════════════');
    console.log('🎉 ВСЕ ТЕСТЫ MAC WINDOW ПРОШЛИ!');
    console.log('═══════════════════════════════════════\n');
    console.log('✅ Gradient фон - работает');
    console.log('✅ Solid фон - работает');
    console.log('✅ Blur фон - работает');
    console.log('✅ Кнопки с градиентами - работают');
    console.log('✅ Версия без кнопок - работает');
    console.log('✅ Preset градиенты - работают');
    console.log('✅ Разные размеры скриншотов - работают');
    console.log('\n📁 Созданы 6 тестовых изображений в папке: test-output/');
    console.log('👀 Проверь их визуально - должны быть стильные как настоящий macOS!');
    console.log('\nОсобенности нового дизайна:');
    console.log('  • Радиус скругления 20px (как в современном macOS)');
    console.log('  • Title bar высотой 52px с градиентом');
    console.log('  • Кнопки с радиальными градиентами и бликами');
    console.log('  • Мягкая реалистичная тень');
    console.log('  • SVG-based рендеринг для идеальной чёткости');
    console.log('\n📝 Следующий шаг: Перейти к iPhone шаблону');
    console.log('🗑️  После проверки удали: rm test-mac-template.js\n');

  } catch (error) {
    console.error('\n❌ ОШИБКА ТЕСТИРОВАНИЯ MAC WINDOW:\n');
    console.error(error);
    console.error('\n🔧 Возможные причины:');
    console.error('   1. Sharp не работает: проверь Этап 0');
    console.error('   2. Background Factory не работает: проверь Этап 1');
    console.error('   3. Ошибка в macWindow.js\n');
    process.exit(1);
  }
}

testMacTemplate();
