/**
 * Генераторы inline-клавиатур
 */

/**
 * Создать клавиатуру выбора шаблона
 */
function createTemplateKeyboard(templates) {
  const buttons = templates.map(template => {
    const emoji = {
      'mac-window': '🖥️',
      'iphone': '📱',
      'layered': '📚'
    }[template.type] || '📄';

    return [{
      text: `${emoji} ${template.name}`,
      callback_data: `template:${template.slug}`
    }];
  });

  return {
    inline_keyboard: [
      ...buttons,
      [{ text: '❌ Отмена', callback_data: 'cancel' }]
    ]
  };
}

/**
 * Создать клавиатуру выбора градиента
 */
function createGradientKeyboard(gradients) {
  const buttons = gradients.map(gradient => {
    return [{
      text: `🎨 ${gradient.name}`,
      callback_data: `gradient:${gradient.slug}`
    }];
  });

  return {
    inline_keyboard: [
      ...buttons,
      [{ text: '🔙 Назад', callback_data: 'back_to_templates' }],
      [{ text: '❌ Отмена', callback_data: 'cancel' }]
    ]
  };
}

/**
 * Создать клавиатуру настроек (радиус, тень)
 */
function createSettingsKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '➖ Радиус', callback_data: 'radius:decrease' },
        { text: '➕ Радиус', callback_data: 'radius:increase' }
      ],
      [
        { text: '➖ Тень', callback_data: 'shadow:decrease' },
        { text: '➕ Тень', callback_data: 'shadow:increase' }
      ],
      [
        { text: '✅ Готово', callback_data: 'settings:done' }
      ],
      [
        { text: '🔙 Назад', callback_data: 'back_to_gradients' },
        { text: '❌ Отмена', callback_data: 'cancel' }
      ]
    ]
  };
}

/**
 * Создать клавиатуру с историей
 */
function createHistoryKeyboard(screenshots) {
  const buttons = screenshots.slice(0, 5).map((screenshot, index) => {
    return [{
      text: `📸 ${screenshot.template_name} + ${screenshot.gradient_name}`,
      callback_data: `history:${screenshot.id}`
    }];
  });

  return {
    inline_keyboard: [
      ...buttons,
      [{ text: '❌ Закрыть', callback_data: 'cancel' }]
    ]
  };
}

module.exports = {
  createTemplateKeyboard,
  createGradientKeyboard,
  createSettingsKeyboard,
  createHistoryKeyboard
};
