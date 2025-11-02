# SnapKit ⚡

## 📝 Описание

**SnapKit** — мгновенный набор инструментов для создания контента в Telegram.

Создавайте красивые share-ссылки с описаниями, обрабатывайте видео, генерируйте плашки и многое другое. Всё работает молниеносно — в диалоговом режиме и через inline.

**Щелк — и готово!** 🚀

## ✨ Возможности

### Основной функционал
- 🔗 Преобразование Telegram-ссылок в share-ссылки с URL-кодированием
- 📸 Оформление скриншотов в стильные mockup-и (Mac, iPhone, Layered)
- 🎨 Градиентные фоны для скриншотов
- 📨 Поддержка пересланных сообщений из каналов
- ⚡ Inline-режим для быстрого создания ссылок прямо в чатах
- 📝 Добавление пользовательского описания к ссылкам
- 🎯 Диалоговый режим с управлением состояниями
- 📊 База данных PostgreSQL для истории и аналитики

### Технические особенности
- 🛡️ Безопасное хранение токена (только в .env)
- 🔄 Graceful shutdown (корректная остановка)
- ❌ Полная обработка ошибок во всех обработчиках
- 🇷🇺 Логи на русском языке
- 🏗️ Модульная архитектура (легко расширять)
- 🐳 Docker-ready (готов к деплою)
- 📊 Асинхронная обработка всех запросов
- 🎨 Canvas-based image processing
- 🗄️ PostgreSQL для хранения данных
- 🔔 n8n webhook интеграция для аналитики

## 🏗️ Архитектура проекта

```
telegram-link-bot/
├── src/
│   ├── bot/
│   │   ├── bot.js          # Инициализация бота
│   │   └── state.js        # Хранилище состояний
│   ├── config/
│   │   └── config.js       # Конфигурация
│   ├── database/
│   │   ├── db.js           # PostgreSQL connection
│   │   └── repositories/   # Репозитории для работы с БД
│   │       ├── templateRepository.js
│   │       ├── gradientRepository.js
│   │       └── screenshotRepository.js
│   ├── handlers/
│   │   ├── commands.js     # Обработчики команд
│   │   ├── messages.js     # Обработчики сообщений
│   │   ├── inline.js       # Inline-режим
│   │   └── screenshot.js   # Обработка скриншотов
│   ├── services/
│   │   ├── imageProcessor.js  # Обработка изображений
│   │   ├── webhookLogger.js   # n8n webhook logging
│   │   └── templates/         # Шаблоны для скриншотов
│   │       ├── macWindow.js   # Mac window style
│   │       ├── iphone.js      # iPhone mockup
│   │       └── layered.js     # Layered effect
│   ├── utils/
│   │   ├── linkUtils.js    # Утилиты для ссылок
│   │   ├── keyboards.js    # Inline keyboard builders
│   │   └── stateManager.js # Менеджер состояний
│   └── index.js            # Точка входа
├── database/
│   └── schema.sql          # PostgreSQL schema
├── .env                    # Переменные окружения (создать вручную)
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── DATABASE_SETUP.md       # Настройка PostgreSQL
└── README.md
```

## 🚀 Быстрый старт

### Требования

- Docker и Docker Compose
- Telegram Bot Token (получить у [@BotFather](https://t.me/BotFather))

### Настройка

1. **Клонируйте репозиторий:**

```bash
git clone https://github.com/PotapKong/telegram-link-bot.git
cd telegram-link-bot
```

2. **Создайте файл `.env`:**

```bash
echo "BOT_TOKEN=ваш_токен_бота" > .env
```

3. **Запустите бота:**

```bash
docker compose up -d --build telegram-link-bot
```

4. **Активируйте inline-режим** (важно!):
   - Откройте [@BotFather](https://t.me/BotFather)
   - Отправьте `/mybots` → выберите бота → `Bot Settings` → `Inline Mode` → `Turn on`
   - Подробности в [INLINE_SETUP.md](./INLINE_SETUP.md)

5. **Проверьте логи:**

```bash
docker compose logs -f telegram-link-bot
```

В логах должно появиться:
```
⚡ Запуск SnapKit Bot...

✅ Бот успешно запущен!
📱 Имя пользователя: @snapkit_bot
🆔 ID бота: 123456789
🚀 Готов к приёму сообщений...

✨ Все обработчики зарегистрированы. SnapKit работает!
```

## 📖 Использование

### Команды бота

- `/start` - Начать работу с ботом
- `/link` - Создать share-ссылку (диалоговый режим)
- `/screenshot` - Оформить скриншот в стильный mockup
- `/help` - Показать справку
- `/cancel` - Отменить текущую операцию

### Диалоговый режим

1. Отправьте команду `/link`
2. Отправьте ссылку или перешлите пост
3. Введите описание
4. Получите готовую share-ссылку

### Inline-режим ⚡

Для быстрого создания ссылок используйте inline-режим в любом чате:

**Формат:**
```
@snapkit_bot https://t.me/channel/123 Описание поста
```

**Примеры:**
```
@snapkit_bot https://t.me/durov/123
@snapkit_bot https://t.me/telegram/456 Новости Telegram
@snapkit_bot t.me/channel/789 Важный пост
```

**Что происходит:**
1. Вы вводите команду в любом чате
2. Бот показывает несколько вариантов ссылок
3. Выбираете нужный вариант
4. Ссылка отправляется в чат

**Варианты результатов:**
- ✨ Share-ссылка (готовая для отправки)
- 📋 Оригинальная ссылка
- 📝 С описанием (если вы его добавили)

> **Важно:** Для работы inline-режима его нужно активировать в [@BotFather](https://t.me/BotFather). См. [INLINE_SETUP.md](./INLINE_SETUP.md)

### Оформление скриншотов 📸

Создавайте стильные mockup-и из обычных скриншотов:

**Формат:**
1. Отправьте `/screenshot`
2. Пришлите скриншот
3. Выберите один из трёх стилей:
   - 🖥️ **Mac Window** — окно macOS с кнопками и title bar
   - 📱 **iPhone** — мокап iPhone с notch и home indicator
   - 📚 **Layered** — многослойный эффект с полупрозрачными слоями
4. Выберите градиент фона:
   - Синий → Фиолетовый
   - Закат (оранжевый → розовый)
   - Океан (голубой → синий)
5. Получите готовый стильный mockup!

**Функции:**
- 🎨 Три красивых градиента фона
- 🖼️ Автоматическое скругление углов
- ✨ Профессиональные тени
- ⚡ Быстрая обработка (обычно < 2 секунд)
- 📊 История всех обработанных скриншотов

**Требования:**
- PostgreSQL база данных (см. [DATABASE_SETUP.md](./DATABASE_SETUP.md))
- Canvas библиотека установлена (уже в package.json)

## 🐳 Docker команды

### Запуск

```bash
# Сборка и запуск
docker compose up -d --build telegram-link-bot

# Только запуск
docker compose up -d telegram-link-bot
```

### Остановка

```bash
# Остановка
docker compose stop telegram-link-bot

# Остановка и удаление контейнера
docker compose down
```

### Логи

```bash
# Просмотр логов (с follow)
docker compose logs -f telegram-link-bot

# Последние 100 строк
docker compose logs --tail=100 telegram-link-bot
```

### Перезапуск

```bash
# Перезапуск контейнера
docker compose restart telegram-link-bot
```

## 🔧 Разработка

### Локальный запуск (без Docker)

```bash
# Установка зависимостей
npm install

# Запуск
npm start
```

### Структура модулей

#### src/bot/
- **bot.js** - Инициализация Telegram бота, настройка error handlers
- **state.js** - Хранилище состояний пользователей (Map)

#### src/handlers/
- **commands.js** - Обработчики команд:
  - `/start` - Приветствие и список команд
  - `/help` - Подробная справка по использованию
  - `/link` - Запуск диалога создания ссылки
  - `/cancel` - Отмена текущей операции
- **messages.js** - Обработка диалога:
  - Ожидание ссылки (текст или пересланное сообщение)
  - Ожидание описания
  - Генерация share-ссылки
- **inline.js** - Inline-режим:
  - Парсинг inline-запроса
  - Извлечение ссылки и описания
  - Формирование вариантов ответа

#### src/utils/
- **linkUtils.js** - Утилиты для работы со ссылками:
  - `extractTelegramLink()` - Извлечение ссылки из текста
  - `extractLinkFromForwarded()` - Получение ссылки из пересланного поста
  - `makeShareLink()` - Создание share-ссылки с URL-кодированием
  - `isValidTelegramLink()` - Валидация ссылки

#### src/config/
- **config.js** - Конфигурация и валидация переменных окружения

#### Корневые файлы
- **src/index.js** - Точка входа, регистрация обработчиков

## 🛡️ Безопасность

### Реализованные меры:
- ✅ Токен хранится только в `.env` файле (не в коде!)
- ✅ `.env` добавлен в `.gitignore` (не попадает в Git)
- ✅ Валидация токена при запуске (бот не запустится без токена)
- ✅ Обработка всех типов ошибок:
  - Polling errors (ошибки подключения к Telegram)
  - Uncaught exceptions (необработанные исключения)
  - Unhandled promise rejections (отклоненные промисы)
  - Try-catch во всех async функциях
- ✅ Graceful shutdown на SIGINT/SIGTERM
- ✅ Безопасное закрытие соединений при остановке

### Рекомендации:
- 🔒 Никогда не коммитьте `.env` файл
- 🔒 Регулярно обновляйте зависимости: `npm update`
- 🔒 Используйте сильные токены от [@BotFather](https://t.me/BotFather)
- 🔒 Ограничьте доступ к серверу где работает бот

## 📋 Roadmap

### ✅ Реализовано (v2.1.0)

#### Функционал:
- [x] Базовый функционал создания share-ссылок
- [x] Поддержка текстовых ссылок и пересланных постов
- [x] Команда `/start` с приветствием
- [x] Команда `/link` для создания ссылок
- [x] Команда `/screenshot` для оформления скриншотов
- [x] Команда `/help` с подробной справкой
- [x] Команда `/cancel` для отмены операций
- [x] Inline-режим для быстрого создания ссылок
- [x] URL-кодирование (правильная обработка пробелов и спецсимволов)
- [x] Три шаблона для скриншотов (Mac, iPhone, Layered)
- [x] Градиентные фоны для скриншотов
- [x] PostgreSQL база данных для истории
- [x] n8n webhook интеграция для аналитики

#### Техническая реализация:
- [x] Модульная архитектура (src/bot, handlers, utils, config, services, database)
- [x] Полная обработка ошибок во всех модулях
- [x] Логи на русском языке с эмодзи
- [x] Graceful shutdown
- [x] Docker-контейнеризация с оптимизацией
- [x] Управление состояниями пользователей
- [x] Асинхронная обработка всех запросов
- [x] Безопасное хранение токена
- [x] Repository pattern для работы с БД
- [x] Canvas-based image processing
- [x] PostgreSQL connection pooling
- [x] Webhook logging для n8n

#### Документация:
- [x] Подробный README с примерами
- [x] DEPLOYMENT.md - инструкции по деплою
- [x] INLINE_SETUP.md - настройка inline-режима
- [x] DATABASE_SETUP.md - настройка PostgreSQL
- [x] deploy.sh - скрипт автоматического деплоя

### 🔜 Планируется

- [ ] Настройка радиуса и тени для скриншотов (UI)
- [ ] Просмотр истории скриншотов
- [ ] Дополнительные шаблоны скриншотов
- [ ] Обработка видео
- [ ] Эмодзи-плашки
- [ ] Web Apps интерфейс
- [ ] Интеграция с другими платформами
- [ ] Шаблоны описаний
- [ ] История ссылок пользователя
- [ ] Расширенная аналитика через n8n

## 🚀 Деплой на сервер

### Быстрый деплой с существующего сервера:

Если бот уже работает и нужно обновить код:

```bash
cd telegram-link-bot && \
git fetch origin claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV && \
git checkout claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV && \
git pull origin claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV && \
docker compose down && \
docker compose up -d --build telegram-link-bot && \
docker compose logs --tail=30 telegram-link-bot
```

### Подробные инструкции:

См. [DEPLOYMENT.md](./DEPLOYMENT.md) для детальных инструкций по:
- Первичному развертыванию
- Обновлению кода
- Устранению неполадок
- Работе с Docker

### Использование deploy.sh:

```bash
./deploy.sh
```

Скрипт автоматически:
1. Скачает последние изменения из Git
2. Пересоберет Docker образ
3. Перезапустит контейнер
4. Покажет логи

## 📊 Логирование

Все логи выводятся на русском языке с эмодзи для удобства:

```
⚡ Запуск SnapKit Bot...

✅ Бот успешно запущен!
📱 Имя пользователя: @snapkit_bot
🆔 ID бота: 123456789
🚀 Готов к приёму сообщений...

✨ Все обработчики зарегистрированы. SnapKit работает!
```

**Типы логов:**
- ✅ Успешные операции (зеленая галочка)
- ❌ Ошибки (красный крестик)
- 📱 Информация о боте
- 🚀 Статус работы
- ⏹️ Остановка бота

**Просмотр логов:**
```bash
# Реального времени
docker compose logs -f telegram-link-bot

# Последние N строк
docker compose logs --tail=100 telegram-link-bot

# Сохранить в файл
docker compose logs telegram-link-bot > bot_logs.txt
```

## 🤝 Вклад в проект

1. Создайте ветку для новой функции: `git checkout -b feature/new-feature`
2. Делайте осмысленные коммиты: `git commit -m "Добавлена функция X"`
3. Запушьте изменения: `git push origin feature/new-feature`
4. Создайте Pull Request с описанием изменений

## 📄 Лицензия

MIT

## 💬 Поддержка

Если у вас возникли проблемы или вопросы, создайте Issue в репозитории.

---

## 📚 Дополнительная документация

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Подробные инструкции по деплою
- [INLINE_SETUP.md](./INLINE_SETUP.md) - Настройка inline-режима через BotFather
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Настройка PostgreSQL для screenshot feature
- [deploy.sh](./deploy.sh) - Скрипт автоматического деплоя

## 🔍 Примеры использования

### Пример 1: Создание share-ссылки на канал

**Диалоговый режим:**
```
Пользователь: /link
Бот: 🔗 Отправьте ссылку на Telegram-пост...

Пользователь: https://t.me/telegram/200
Бот: ✅ Ссылка получена!
     📝 Теперь отправьте описание...

Пользователь: Важные новости от Telegram
Бот: ✨ Готовая ссылка для шаринга:
     https://t.me/share/url?url=https%3A%2F%2Ft.me%2Ftelegram%2F200&text=Важные%20новости%20от%20Telegram
```

### Пример 2: Быстрое создание через inline

**В любом чате:**
```
@snapkit_bot https://t.me/durov/123 Пост от Дурова
```

**Бот предложит:**
- ✨ Share-ссылка создана
- 📋 Оригинальная ссылка
- 📝 С описанием

### Пример 3: Пересланное сообщение

```
Пользователь: /link
Бот: 🔗 Отправьте ссылку...

Пользователь: [пересылает пост из канала]
Бот: ✅ Ссылка получена!
     📝 Теперь отправьте описание...

Пользователь: Интересная статья
Бот: ✨ Готовая ссылка для шаринга: ...
```

---

**Название:** SnapKit ⚡
**Username:** @snapkit_bot
**Версия:** 2.1.0
**Слоган:** Щелк — и готово!
**Последнее обновление:** 2025-11-02
**Ветка разработки:** `claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV`
