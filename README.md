# Telegram Link Bot

## 📝 Описание

Telegram-бот для преобразования ссылок на посты в красивые share-ссылки с описанием. Поддерживает как диалоговый режим, так и inline-режим для быстрой работы.

## ✨ Возможности

- 🔗 Преобразование Telegram-ссылок в share-ссылки
- 📨 Поддержка пересланных сообщений
- ⚡ Inline-режим для быстрого создания ссылок
- 📝 Добавление описания к ссылкам
- 🛡️ Безопасное хранение токена
- 🔄 Graceful shutdown и обработка ошибок
- 🎯 Модульная архитектура

## 🏗️ Архитектура проекта

```
telegram-link-bot/
├── src/
│   ├── bot/
│   │   ├── bot.js          # Инициализация бота
│   │   └── state.js        # Хранилище состояний
│   ├── config/
│   │   └── config.js       # Конфигурация
│   ├── handlers/
│   │   ├── commands.js     # Обработчики команд
│   │   ├── messages.js     # Обработчики сообщений
│   │   └── inline.js       # Inline-режим
│   ├── utils/
│   │   └── linkUtils.js    # Утилиты для ссылок
│   └── index.js            # Точка входа
├── .env                     # Переменные окружения (создать вручную)
├── .gitignore
├── Dockerfile
├── docker-compose.override.yml
├── package.json
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

4. **Проверьте логи:**

```bash
docker compose logs -f telegram-link-bot
```

## 📖 Использование

### Команды бота

- `/start` - Начать работу с ботом
- `/link` - Создать share-ссылку (диалоговый режим)
- `/help` - Показать справку
- `/cancel` - Отменить текущую операцию

### Диалоговый режим

1. Отправьте команду `/link`
2. Отправьте ссылку или перешлите пост
3. Введите описание
4. Получите готовую share-ссылку

### Inline-режим

Для быстрого создания ссылок используйте inline-режим:

```
@your_bot_username https://t.me/channel/123 Описание поста
```

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

- **bot/bot.js** - Инициализация Telegram бота, обработка ошибок
- **handlers/commands.js** - Обработчики команд (/start, /help, /link, /cancel)
- **handlers/messages.js** - Обработка текстовых сообщений и состояний
- **handlers/inline.js** - Inline-режим для быстрого создания ссылок
- **utils/linkUtils.js** - Утилиты для работы со ссылками
- **config/config.js** - Конфигурация приложения

## 🛡️ Безопасность

- ✅ Токен хранится только в `.env` файле
- ✅ `.env` добавлен в `.gitignore`
- ✅ Валидация токена при запуске
- ✅ Обработка всех ошибок
- ✅ Graceful shutdown

## 📋 Roadmap

### ✅ Реализовано (v2.0.0)

- [x] Базовый функционал создания ссылок
- [x] Модульная архитектура
- [x] Команды /help и /cancel
- [x] Inline-режим
- [x] Обработка ошибок
- [x] Docker-контейнеризация

### 🔜 Планируется

- [ ] База данных для статистики
- [ ] Аналитика использования
- [ ] Обработка видео
- [ ] Эмодзи-плашки
- [ ] Web Apps интерфейс
- [ ] Интеграция с другими платформами
- [ ] Шаблоны описаний
- [ ] История ссылок пользователя

## 🤝 Вклад в проект

1. Создайте ветку для новой функции
2. Делайте осмысленные коммиты
3. Создайте Pull Request с описанием изменений

## 📄 Лицензия

MIT

## 💬 Поддержка

Если у вас возникли проблемы или вопросы, создайте Issue в репозитории.

---

**Версия:** 2.0.0
**Последнее обновление:** 2025-10-31
