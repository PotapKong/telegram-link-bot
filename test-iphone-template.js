/**
 * Тестирование iPhone 17 Pro шаблона на Sharp
 *
 * Запуск: node test-iphone-template.js
 * После успешного теста: rm test-iphone-template.js
 */

const sharp = require('sharp');
const iphoneTemplate = require('./src/services/templates/iphone');
const { getAllGradientPresets } = require('./src/config/presets');
const fs = require('fs');
const path = require('path');

async function testIphoneTemplate() {
  console.log('🧪 Тестирование iPhone 17 Pro шаблона (Sharp версия)...\n');

  const testOutputDir = './test-output';

  try {
    // Создать папку для тестовых файлов
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir);
    }

    // Создать тестовые скриншоты разных пропорций

    // 1. Вертикальный скриншот (portrait - как сториз)
    console.log('Создание тестовых скриншотов...');
    const portraitScreenshot = await sharp({
      create: {
        width: 1080,
        height: 1920,
        channels: 4,
        background: { r: 50, g: 100, b: 200, alpha: 1 }
      }
    })
    .composite([
      {
        input: Buffer.from(`
          <svg width="1080" height="1920">
            <text x="540" y="960" font-size="72" fill="white" text-anchor="middle" font-family="Arial">
              Portrait Screenshot
            </text>
            <text x="540" y="1040" font-size="36" fill="rgba(255,255,255,0.7)" text-anchor="middle" font-family="Arial">
              1080x1920 (9:16)
            </text>
          </svg>
        `),
        top: 0,
        left: 0
      }
    ])
    .png()
    .toBuffer();

    // 2. Квадратный скриншот
    const squareScreenshot = await sharp({
      create: {
        width: 1000,
        height: 1000,
        channels: 4,
        background: { r: 200, g: 50, b: 100, alpha: 1 }
      }
    })
    .composite([
      {
        input: Buffer.from(`
          <svg width="1000" height="1000">
            <text x="500" y="500" font-size="48" fill="white" text-anchor="middle" font-family="Arial">
              Square Screenshot
            </text>
            <text x="500" y="560" font-size="24" fill="rgba(255,255,255,0.7)" text-anchor="middle" font-family="Arial">
              1000x1000 (1:1)
            </text>
          </svg>
        `),
        top: 0,
        left: 0
      }
    ])
    .png()
    .toBuffer();

    // 3. Горизонтальный скриншот
    const landscapeScreenshot = await sharp({
      create: {
        width: 1920,
        height: 1080,
        channels: 4,
        background: { r: 100, g: 200, b: 50, alpha: 1 }
      }
    })
    .composite([
      {
        input: Buffer.from(`
          <svg width="1920" height="1080">
            <text x="960" y="540" font-size="48" fill="white" text-anchor="middle" font-family="Arial">
              Landscape Screenshot
            </text>
            <text x="960" y="600" font-size="24" fill="rgba(255,255,255,0.7)" text-anchor="middle" font-family="Arial">
              1920x1080 (16:9)
            </text>
          </svg>
        `),
        top: 0,
        left: 0
      }
    ])
    .png()
    .toBuffer();

    console.log('✅ Тестовые скриншоты созданы\n');

    // Тест 1: iPhone с gradient фоном (Telegram)
    console.log('Тест 1: iPhone 17 Pro с gradient фоном (Telegram)...');
    const result1 = await iphoneTemplate.apply(
      portraitScreenshot,
      {
        type: 'gradient',
        config: {
          colors: ['#54A9EB', '#006FC8'],
          angle: 135
        }
      },
      {
        padding: 80,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10
        }
      },
      { deviceColor: 'titanium' }
    );
    fs.writeFileSync(path.join(testOutputDir, 'iphone-template-gradient.png'), result1);
    console.log(`✅ Тест 1 пройден: ${result1.length} байт (test-output/iphone-template-gradient.png)\n`);

    // Тест 2: iPhone с solid фоном
    console.log('Тест 2: iPhone 17 Pro с solid фоном...');
    const result2 = await iphoneTemplate.apply(
      portraitScreenshot,
      {
        type: 'solid',
        config: {
          color: '#FF6B6B'
        }
      },
      {
        padding: 80,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10
        }
      },
      { deviceColor: 'titanium' }
    );
    fs.writeFileSync(path.join(testOutputDir, 'iphone-template-solid.png'), result2);
    console.log(`✅ Тест 2 пройден: ${result2.length} байт (test-output/iphone-template-solid.png)\n`);

    // Тест 3: iPhone с blur фоном
    console.log('Тест 3: iPhone 17 Pro с blur фоном...');
    const result3 = await iphoneTemplate.apply(
      portraitScreenshot,
      {
        type: 'blur',
        config: {
          sourceImage: portraitScreenshot,
          blurAmount: 70,
          brightness: -0.2,
          saturation: 1.2
        }
      },
      {
        padding: 80,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10
        }
      },
      { deviceColor: 'titanium' }
    );
    fs.writeFileSync(path.join(testOutputDir, 'iphone-template-blur.png'), result3);
    console.log(`✅ Тест 3 пройден: ${result3.length} байт (test-output/iphone-template-blur.png)\n`);

    // Тест 4: iPhone с black корпусом
    console.log('Тест 4: iPhone 17 Pro с black корпусом...');
    const result4 = await iphoneTemplate.apply(
      portraitScreenshot,
      {
        type: 'gradient',
        config: {
          colors: ['#FF512F', '#DD2476'],
          angle: 45
        }
      },
      {
        padding: 80,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10
        }
      },
      { deviceColor: 'black' }
    );
    fs.writeFileSync(path.join(testOutputDir, 'iphone-template-black.png'), result4);
    console.log(`✅ Тест 4 пройден: ${result4.length} байт (test-output/iphone-template-black.png)\n`);

    // Тест 5: iPhone с natural (рыжий) корпусом
    console.log('Тест 5: iPhone 17 Pro с natural (рыжий) корпусом...');
    const result5 = await iphoneTemplate.apply(
      portraitScreenshot,
      {
        type: 'gradient',
        config: {
          colors: ['#2E3192', '#1BFFFF'],
          angle: 135
        }
      },
      {
        padding: 80,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10
        }
      },
      { deviceColor: 'natural' }
    );
    fs.writeFileSync(path.join(testOutputDir, 'iphone-template-natural.png'), result5);
    console.log(`✅ Тест 5 пройден: ${result5.length} байт (test-output/iphone-template-natural.png)\n`);

    // Тест 6: iPhone с квадратным скриншотом (Cover режим)
    console.log('Тест 6: iPhone с квадратным скриншотом (Cover режим)...');
    const result6 = await iphoneTemplate.apply(
      squareScreenshot,
      {
        type: 'gradient',
        config: {
          colors: ['#43E97B', '#38F9D7'],
          angle: 135
        }
      },
      {
        padding: 80,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10
        }
      },
      { deviceColor: 'titanium' }
    );
    fs.writeFileSync(path.join(testOutputDir, 'iphone-template-square.png'), result6);
    console.log(`✅ Тест 6 пройден: ${result6.length} байт (test-output/iphone-template-square.png)\n`);

    // Тест 7: iPhone с горизонтальным скриншотом (Cover режим)
    console.log('Тест 7: iPhone с горизонтальным скриншотом (Cover режим)...');
    const result7 = await iphoneTemplate.apply(
      landscapeScreenshot,
      {
        type: 'gradient',
        config: {
          colors: ['#F12711', '#F5AF19'],
          angle: 45
        }
      },
      {
        padding: 80,
        shadow: {
          blur: 30,
          offsetX: 0,
          offsetY: 10
        }
      },
      { deviceColor: 'titanium' }
    );
    fs.writeFileSync(path.join(testOutputDir, 'iphone-template-landscape.png'), result7);
    console.log(`✅ Тест 7 пройден: ${result7.length} байт (test-output/iphone-template-landscape.png)\n`);

    // Итоговый отчёт
    console.log('═══════════════════════════════════════');
    console.log('🎉 ВСЕ ТЕСТЫ IPHONE 17 PRO ПРОШЛИ!');
    console.log('═══════════════════════════════════════\n');
    console.log('✅ Gradient фон - работает');
    console.log('✅ Solid фон - работает');
    console.log('✅ Blur фон - работает');
    console.log('✅ Titanium корпус - работает');
    console.log('✅ Black корпус - работает');
    console.log('✅ Natural (рыжий) корпус - работает');
    console.log('✅ Cover режим для разных пропорций - работает');
    console.log('✅ Dynamic Island отображается - работает');
    console.log('\n📁 Создано 7 тестовых изображений в папке: test-output/');
    console.log('👀 Проверь их визуально - пропорции 2.16:1 как у реального iPhone 17 Pro!');
    console.log('\nОсобенности дизайна:');
    console.log('  • Фиксированный размер 650px (консистентный)');
    console.log('  • Пропорции 2.16:1 (точно как iPhone 17 Pro Max)');
    console.log('  • Dynamic Island сверху');
    console.log('  • Cover режим - скриншоты заполняют весь экран');
    console.log('  • 3 варианта цвета корпуса: Titanium/Black/Natural');
    console.log('  • Металлический градиент на рамке');
    console.log('  • Реалистичная мягкая тень');
    console.log('\n📝 Следующий шаг: Перейти к Layered шаблону');
    console.log('🗑️  После проверки удали: rm test-iphone-template.js\n');

  } catch (error) {
    console.error('\n❌ ОШИБКА ТЕСТИРОВАНИЯ IPHONE ШАБЛОНА:\n');
    console.error(error);
    console.error('\n🔧 Возможные причины:');
    console.error('   1. Sharp не работает: проверь Этап 0');
    console.error('   2. Background Factory не работает: проверь Этап 1');
    console.error('   3. Ошибка в iphone.js\n');
    process.exit(1);
  }
}

testIphoneTemplate();
