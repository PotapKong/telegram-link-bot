const userStates = require('../bot/state');

const BACKGROUNDS = [
  { label: 'Тропики', value: 'tropics', preview: 'gradient-green-yellow.png' },
  { label: 'Фиалка', value: 'violet', preview: 'gradient-violet-pink.png' },
  { label: 'Минимализм', value: 'minimalism', preview: 'minimalism.png' },
  { label: 'Персиковый', value: 'peach', preview: 'peach-gradient.png' },
  { label: 'Цвет Telegram', value: 'telegram', preview: 'telegram-blue.png' },
  { label: 'Размытие фона', value: 'blur', preview: 'blur-background.png' },
  { label: 'RGB', value: 'rgb', preview: null }
];

// Логика отправки клавиатуры с выбором фона
async function sendBackgroundKeyboard(bot, chatId) {
  const buttons = BACKGROUNDS.map(bg => ({ text: bg.label }));

  await bot.sendMessage(chatId, '🎨 Выберите фон для скриншота:', {
    reply_markup: {
      keyboard: [buttons.map(btn => btn.text)],
      one_time_keyboard: true,
      resize_keyboard: true
    }
  });
}

// Обработка выбора фонового варианта
async function handleWaitingBackground(bot, msg, chatId, state) {
  const chosen = BACKGROUNDS.find(bg => bg.label === msg.text);

  if (!chosen) {
    await bot.sendMessage(chatId, '❗ Пожалуйста, выберите вариант из клавиатуры.');
    await sendBackgroundKeyboard(bot, chatId);
    return;
  }

  userStates.set(chatId, {
    ...state,
    step: 'waiting_size',
    background: chosen.value
  });

  // Если выбран RGB, запрашиваем цвет
  if (chosen.value === 'rgb') {
    await bot.sendMessage(chatId, 'Введите цвет в формате HEX, например: #aabbcc');
    return;
  }

  // В противном случае, отправляем предпросмотр (если есть)
  if (chosen.preview) {
    await bot.sendPhoto(chatId, `./images/backgrounds/${chosen.preview}`, { caption: `Вы выбрали фон: ${chosen.label}` });
  } else {
    await bot.sendMessage(chatId, `Вы выбрали фон: ${chosen.label}`);
  }

  // Переходим к следующему шагу: выбор размера
  await sendSizeKeyboard(bot, chatId);
}

// Предоставляем выбор размера
const SIZES = [
  { label: 'Extra Small', value: 'xs' },
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' }
];

async function sendSizeKeyboard(bot, chatId) {
  const buttons = SIZES.map(size => ({ text: size.label }));
  await bot.sendMessage(chatId, '📐 Выберите размер скриншота:', {
    reply_markup: {
      keyboard: [buttons.map(btn => btn.text)],
      one_time_keyboard: true,
      resize_keyboard: true
    }
  });
}

module.exports = {
  sendBackgroundKeyboard,
  handleWaitingBackground,
  sendSizeKeyboard
};
