-- SnapKit Database Schema
-- Screenshot decoration feature

-- Шаблоны оформления
CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL, -- 'mac-window', 'iphone', 'layered', 'custom'
  settings JSONB NOT NULL DEFAULT '{}', -- специфичные настройки шаблона
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Градиенты для фонов
CREATE TABLE IF NOT EXISTS gradients (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  colors JSONB NOT NULL, -- массив цветов ['#color1', '#color2']
  angle INTEGER DEFAULT 135, -- угол градиента
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- История обработки скриншотов пользователей
CREATE TABLE IF NOT EXISTS user_screenshots (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  username VARCHAR(100),
  template_id INTEGER REFERENCES templates(id),
  gradient_id INTEGER REFERENCES gradients(id),
  settings JSONB, -- радиус, тень, кастомные параметры
  original_file_id VARCHAR(200), -- Telegram file_id оригинала
  processed_file_id VARCHAR(200), -- Telegram file_id результата
  processing_time_ms INTEGER, -- время обработки
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Статистика использования (для аналитики)
CREATE TABLE IF NOT EXISTS usage_stats (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'screenshot_created', 'template_selected', etc.
  data JSONB, -- дополнительные данные
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_user_screenshots_user_id ON user_screenshots(user_id);
CREATE INDEX IF NOT EXISTS idx_user_screenshots_created_at ON user_screenshots(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_stats_user_id ON usage_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_stats_action ON usage_stats(action);
CREATE INDEX IF NOT EXISTS idx_usage_stats_created_at ON usage_stats(created_at);

-- Вставка начальных шаблонов
INSERT INTO templates (slug, name, description, type, settings, sort_order) VALUES
  ('mac-window', 'Mac Window', 'Стиль окна macOS с кнопками управления', 'mac-window',
   '{"windowButtons": true, "titleBar": true, "titleBarHeight": 40, "buttonSize": 12}'::jsonb, 1),
  ('iphone', 'iPhone Mockup', 'Скриншот в рамке iPhone', 'iphone',
   '{"deviceColor": "black", "notch": true, "homeIndicator": true}'::jsonb, 2),
  ('layered', 'Layered Style', 'Несколько полупрозрачных слоев', 'layered',
   '{"layers": 3, "layerOpacity": 0.3, "layerOffset": 8}'::jsonb, 3)
ON CONFLICT (slug) DO NOTHING;

-- Вставка начальных градиентов
INSERT INTO gradients (slug, name, colors, angle, sort_order) VALUES
  ('blue-purple', 'Синий → Фиолетовый', '["#667eea", "#764ba2"]'::jsonb, 135, 1),
  ('sunset', 'Закат', '["#f093fb", "#f5576c"]'::jsonb, 135, 2),
  ('ocean', 'Океан', '["#2E3192", "#1BFFFF"]'::jsonb, 135, 3)
ON CONFLICT (slug) DO NOTHING;

-- Комментарии для документации
COMMENT ON TABLE templates IS 'Шаблоны оформления для скриншотов';
COMMENT ON TABLE gradients IS 'Градиенты для фонов';
COMMENT ON TABLE user_screenshots IS 'История обработанных скриншотов пользователей';
COMMENT ON TABLE usage_stats IS 'Статистика использования для аналитики';
