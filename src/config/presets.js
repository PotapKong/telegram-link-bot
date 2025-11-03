/**
 * Preset конфигурации для фонов
 */

/**
 * Preset градиенты
 * Коллекция красивых градиентов для фонов скриншотов
 */
const GRADIENT_PRESETS = {
  tropics: {
    name: '🌴 Тропики',
    slug: 'tropics',
    type: 'gradient',
    config: {
      colors: ['#43E97B', '#38F9D7'],
      angle: 135,
      type: 'linear'
    }
  },
  violet: {
    name: '💜 Фиалка',
    slug: 'violet',
    type: 'gradient',
    config: {
      colors: ['#7F00FF', '#E100FF'],
      angle: 135,
      type: 'linear'
    }
  },
  peach: {
    name: '🍑 Персик',
    slug: 'peach',
    type: 'gradient',
    config: {
      colors: ['#FFE259', '#FFA751'],
      angle: 135,
      type: 'linear'
    }
  },
  telegram: {
    name: '📱 Telegram',
    slug: 'telegram',
    type: 'gradient',
    config: {
      colors: ['#54A9EB', '#006FC8'],
      angle: 135,
      type: 'linear'
    }
  },
  sunset: {
    name: '🌅 Закат',
    slug: 'sunset',
    type: 'gradient',
    config: {
      colors: ['#FF512F', '#DD2476'],
      angle: 135,
      type: 'linear'
    }
  },
  ocean: {
    name: '🌊 Океан',
    slug: 'ocean',
    type: 'gradient',
    config: {
      colors: ['#2E3192', '#1BFFFF'],
      angle: 135,
      type: 'linear'
    }
  },
  fire: {
    name: '🔥 Огонь',
    slug: 'fire',
    type: 'gradient',
    config: {
      colors: ['#F12711', '#F5AF19'],
      angle: 45,
      type: 'linear'
    }
  },
  mint: {
    name: '🌿 Мята',
    slug: 'mint',
    type: 'gradient',
    config: {
      colors: ['#00F260', '#0575E6'],
      angle: 135,
      type: 'linear'
    }
  }
};

/**
 * Preset однотонные цвета
 * Подобранные цвета для минималистичных фонов
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
    slug: 'peach_solid',
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
    slug: 'mint_solid',
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
 *
 * @returns {Array<Object>} Массив градиентов
 */
function getAllGradientPresets() {
  return Object.values(GRADIENT_PRESETS);
}

/**
 * Получить все preset цвета
 *
 * @returns {Array<Object>} Массив цветов
 */
function getAllSolidPresets() {
  return Object.values(SOLID_PRESETS);
}

/**
 * Получить preset по slug
 *
 * @param {string} slug - Slug пресета
 * @returns {Object|null} Preset или null если не найден
 */
function getPresetBySlug(slug) {
  return GRADIENT_PRESETS[slug] || SOLID_PRESETS[slug] || null;
}

/**
 * Получить все presets (градиенты + цвета)
 *
 * @returns {Array<Object>} Массив всех пресетов
 */
function getAllPresets() {
  return [...getAllGradientPresets(), ...getAllSolidPresets()];
}

module.exports = {
  GRADIENT_PRESETS,
  SOLID_PRESETS,
  getAllGradientPresets,
  getAllSolidPresets,
  getPresetBySlug,
  getAllPresets
};
