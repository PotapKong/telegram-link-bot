# 🔑 Инструкция по обновлению токена бота

Если вы создали нового бота или изменили токен, вот как обновить его на сервере:

---

## 📝 Шаг 1: Получите новый токен от BotFather

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/mybots`
3. Выберите вашего бота (@snapkit_bot)
4. Нажмите **"API Token"**
5. Скопируйте токен (формат: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

---

## 🖥️ Шаг 2: Обновите токен на сервере

### Вариант А: Через редактор (nano)

```bash
# Перейдите в директорию бота
cd telegram-link-bot

# Откройте файл .env в редакторе
nano .env

# Замените старый токен на новый
# Было: BOT_TOKEN=старый_токен
# Стало: BOT_TOKEN=новый_токен

# Сохраните: Ctrl+O, Enter, Ctrl+X
```

### Вариант Б: Через команду (быстрее)

```bash
# Перейдите в директорию бота
cd telegram-link-bot

# Замените токен одной командой (замените YOUR_NEW_TOKEN на ваш токен)
echo "BOT_TOKEN=YOUR_NEW_TOKEN" > .env
```

**Пример:**
```bash
echo "BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz" > .env
```

---

## 🔄 Шаг 3: Перезапустите бота

```bash
# Остановите и запустите бота заново
docker compose down && docker compose up -d --build telegram-link-bot
```

Или используйте скрипт deploy.sh:
```bash
./deploy.sh
```

---

## ✅ Шаг 4: Проверьте логи

```bash
docker compose logs -f telegram-link-bot
```

Вы должны увидеть:
```
⚡ Запуск SnapKit Bot...

✅ Бот успешно запущен!
📱 Имя пользователя: @snapkit_bot
🆔 ID бота: 1234567890
🚀 Готов к приёму сообщений...
```

---

## ❌ Устранение проблем

### Ошибка: "BOT_TOKEN не установлен"

```
❌ ОШИБКА: BOT_TOKEN не установлен в переменных окружения!
```

**Решение:**
1. Проверьте, что файл `.env` существует:
   ```bash
   cat .env
   ```
2. Убедитесь, что токен правильно записан (без пробелов):
   ```
   BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
3. Перезапустите бота

### Ошибка: "401 Unauthorized"

```
❌ Ошибка polling: 401 Unauthorized
```

**Причина:** Неверный токен

**Решение:**
1. Проверьте токен в [@BotFather](https://t.me/BotFather)
2. Убедитесь, что скопировали токен полностью
3. Обновите `.env` файл
4. Перезапустите бота

---

## 🔐 Безопасность

**ВАЖНО:**
- ❌ **НИКОГДА** не публикуйте токен в Git
- ❌ **НИКОГДА** не передавайте токен третьим лицам
- ✅ Храните токен только в `.env` файле
- ✅ `.env` уже добавлен в `.gitignore`

---

## 📋 Полная команда для обновления (копируйте целиком)

**Замените YOUR_NEW_TOKEN на ваш токен:**

```bash
cd telegram-link-bot && \
echo "BOT_TOKEN=YOUR_NEW_TOKEN" > .env && \
docker compose down && \
docker compose up -d --build telegram-link-bot && \
docker compose logs --tail=30 telegram-link-bot
```

**Пример с реальным токеном:**
```bash
cd telegram-link-bot && \
echo "BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz" > .env && \
docker compose down && \
docker compose up -d --build telegram-link-bot && \
docker compose logs --tail=30 telegram-link-bot
```

---

**Готово!** Ваш бот теперь работает с новым токеном! ⚡
