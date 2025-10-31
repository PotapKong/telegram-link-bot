# 🚀 Инструкция по деплою

## Быстрый деплой (рекомендуется)

### Использование deploy.sh скрипта:

```bash
# Переход в директорию проекта
cd telegram-link-bot

# Запуск деплоя
./deploy.sh
```

---

## Ручной деплой

### 1. Первоначальная настройка (только один раз)

```bash
# Клонирование репозитория
git clone https://github.com/PotapKong/telegram-link-bot.git
cd telegram-link-bot

# Создание .env файла с токеном бота
echo "BOT_TOKEN=ваш_токен_бота" > .env

# Checkout тестовой ветки
git checkout claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV
```

### 2. Деплой тестовой ветки

```bash
# Переход в директорию проекта
cd telegram-link-bot

# Получение последних изменений
git fetch origin claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV

# Переключение на тестовую ветку
git checkout claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV

# Обновление кода
git pull origin claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV

# Остановка старого контейнера
docker compose down

# Сборка и запуск нового контейнера
docker compose up -d --build telegram-link-bot

# Просмотр логов
docker compose logs -f telegram-link-bot
```

---

## Команды для Termius (копировать целиком)

### 🔹 Первый запуск:

```bash
cd /path/to/project && \
git clone https://github.com/PotapKong/telegram-link-bot.git && \
cd telegram-link-bot && \
echo "BOT_TOKEN=ваш_токен_бота" > .env && \
git checkout claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV && \
docker compose up -d --build telegram-link-bot && \
docker compose logs -f telegram-link-bot
```

### 🔹 Обновление и перезапуск:

```bash
cd telegram-link-bot && \
git fetch origin claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV && \
git checkout claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV && \
git pull origin claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV && \
docker compose down && \
docker compose up -d --build telegram-link-bot && \
docker compose logs --tail=50 telegram-link-bot
```

### 🔹 Использование deploy.sh:

```bash
cd telegram-link-bot && \
./deploy.sh claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV
```

---

## Полезные команды

### Просмотр логов:
```bash
docker compose logs -f telegram-link-bot
```

### Просмотр последних 100 строк логов:
```bash
docker compose logs --tail=100 telegram-link-bot
```

### Просмотр статуса:
```bash
docker compose ps telegram-link-bot
```

### Перезапуск без пересборки:
```bash
docker compose restart telegram-link-bot
```

### Остановка:
```bash
docker compose stop telegram-link-bot
```

### Полная остановка с удалением контейнера:
```bash
docker compose down
```

### Проверка использования ресурсов:
```bash
docker stats telegram-link-bot-telegram-link-bot-1
```

---

## Активация Inline-режима

После деплоя не забудьте активировать inline-режим через [@BotFather](https://t.me/BotFather).

Подробная инструкция в файле: [INLINE_SETUP.md](./INLINE_SETUP.md)

Кратко:
1. Откройте [@BotFather](https://t.me/BotFather)
2. `/mybots` → выберите бота → `Bot Settings` → `Inline Mode` → `Turn on`

---

## Проверка работы бота

После деплоя проверьте, что бот работает:

1. **Проверка логов:**
   ```bash
   docker compose logs telegram-link-bot
   ```

   Должны увидеть:
   ```
   ✅ Bot started successfully!
   📱 Username: @your_bot_username
   🆔 Bot ID: 123456789
   🚀 Ready to receive messages...
   ```

2. **Проверка в Telegram:**
   - Отправьте `/start` боту
   - Проверьте команду `/help`
   - Попробуйте создать ссылку через `/link`
   - Протестируйте inline-режим: `@bot_username https://t.me/channel/123`

---

## Устранение проблем

### Бот не запускается:

```bash
# Проверить логи на ошибки
docker compose logs telegram-link-bot

# Проверить, что BOT_TOKEN установлен
cat .env

# Пересобрать образ с нуля
docker compose down
docker compose build --no-cache telegram-link-bot
docker compose up -d telegram-link-bot
```

### Бот не отвечает:

```bash
# Проверить, что контейнер запущен
docker compose ps

# Перезапустить контейнер
docker compose restart telegram-link-bot

# Проверить логи
docker compose logs -f telegram-link-bot
```

### Проблемы с памятью/CPU:

```bash
# Проверить использование ресурсов
docker stats

# Ограничить ресурсы (добавить в docker-compose.override.yml):
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

---

## Откат на предыдущую версию

```bash
cd telegram-link-bot

# Посмотреть историю коммитов
git log --oneline

# Откатиться на конкретный коммит
git checkout <commit_hash>

# Пересобрать и перезапустить
docker compose down
docker compose up -d --build telegram-link-bot
```

---

**Версия:** 2.0.0
**Последнее обновление:** 2025-10-31
