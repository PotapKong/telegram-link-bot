# 📊 Настройка PostgreSQL для SnapKit

Руководство по настройке базы данных для функции оформления скриншотов.

## Предварительные требования

- PostgreSQL 12+ установлен на сервере
- Доступ к PostgreSQL через Docker network или localhost

## Шаг 1: Создание базы данных

Подключитесь к PostgreSQL и создайте базу данных:

```bash
# Подключение к PostgreSQL (если через Docker)
docker exec -it postgres_container psql -U postgres

# Или напрямую
psql -U postgres
```

```sql
-- Создать базу данных
CREATE DATABASE snapkit;

-- Создать пользователя
CREATE USER snapkit WITH PASSWORD 'your_secure_password';

-- Выдать права
GRANT ALL PRIVILEGES ON DATABASE snapkit TO snapkit;
```

## Шаг 2: Применение схемы

Выполните SQL-скрипт из `database/schema.sql`:

```bash
# Если PostgreSQL в Docker
docker exec -i postgres_container psql -U snapkit -d snapkit < database/schema.sql

# Или напрямую
psql -U snapkit -d snapkit -f database/schema.sql
```

Схема создаст следующие таблицы:
- `templates` - шаблоны оформления (Mac, iPhone, Layered)
- `gradients` - градиенты для фона
- `user_screenshots` - история обработанных скриншотов
- `usage_stats` - статистика использования

## Шаг 3: Настройка переменных окружения

Отредактируйте `.env` файл:

```env
# PostgreSQL подключение
DATABASE_URL=postgresql://snapkit:your_secure_password@postgres_host:5432/snapkit

# Или через отдельные параметры:
DB_HOST=postgres_host
DB_PORT=5432
DB_USER=snapkit
DB_PASSWORD=your_secure_password
DB_NAME=snapkit
```

### Варианты подключения:

**1. PostgreSQL в Docker на том же хосте:**
```env
DATABASE_URL=postgresql://snapkit:password@postgres:5432/snapkit
```

**2. PostgreSQL на localhost:**
```env
DATABASE_URL=postgresql://snapkit:password@localhost:5432/snapkit
```

**3. PostgreSQL на удалённом сервере:**
```env
DATABASE_URL=postgresql://snapkit:password@192.168.1.100:5432/snapkit
```

## Шаг 4: Настройка Docker Networking

Если PostgreSQL запущен в Docker, убедитесь что оба контейнера в одной сети:

```bash
# Создать общую сеть
docker network create snapkit_network

# Подключить PostgreSQL к сети (если ещё не подключен)
docker network connect snapkit_network postgres_container

# Запустить бота (docker-compose уже настроен)
docker-compose up -d
```

В `docker-compose.yml` укажите имя сети:

```yaml
networks:
  external_network:
    external: true
    name: snapkit_network
```

## Шаг 5: Проверка подключения

После запуска бота проверьте логи:

```bash
docker-compose logs -f
```

Вы должны увидеть:
```
📊 Подключение к PostgreSQL...
✅ PostgreSQL подключен: 2025-01-15 10:00:00
✅ База данных инициализирована
```

## Проверка данных

Проверьте что шаблоны и градиенты загружены:

```sql
-- Проверить шаблоны
SELECT id, slug, name, type FROM templates;

-- Должно вернуть:
-- 1 | mac-window | Mac Window     | mac-window
-- 2 | iphone     | iPhone Mockup  | iphone
-- 3 | layered    | Layered Style  | layered

-- Проверить градиенты
SELECT id, slug, name FROM gradients;

-- Должно вернуть:
-- 1 | blue-purple | Синий → Фиолетовый
-- 2 | sunset      | Закат
-- 3 | ocean       | Океан
```

## Миграции и обновления

При обновлении схемы используйте миграции:

```bash
# Бэкап перед обновлением
docker exec postgres_container pg_dump -U snapkit snapkit > backup.sql

# Применить изменения
psql -U snapkit -d snapkit -f database/migrations/001_add_new_field.sql
```

## Мониторинг

Проверить количество обработанных скриншотов:

```sql
SELECT COUNT(*) as total_screenshots,
       AVG(processing_time_ms) as avg_time
FROM user_screenshots;
```

Статистика по шаблонам:

```sql
SELECT t.name, COUNT(*) as usage_count
FROM user_screenshots us
JOIN templates t ON us.template_id = t.id
GROUP BY t.name
ORDER BY usage_count DESC;
```

## Troubleshooting

### Ошибка подключения

```
❌ PostgreSQL недоступен: connection refused
```

**Решение:**
1. Проверьте что PostgreSQL запущен: `docker ps | grep postgres`
2. Проверьте сетевое подключение: `docker network ls`
3. Проверьте DATABASE_URL в `.env`

### Ошибка аутентификации

```
❌ PostgreSQL недоступен: password authentication failed
```

**Решение:**
1. Проверьте пароль в `.env`
2. Проверьте что пользователь существует: `\du` в psql

### Таблицы не созданы

```
❌ relation "templates" does not exist
```

**Решение:**
Выполните `database/schema.sql` заново:
```bash
psql -U snapkit -d snapkit -f database/schema.sql
```

## Безопасность

1. **Не используйте пароль по умолчанию** - задайте сложный пароль
2. **Ограничьте доступ к PostgreSQL** - только из Docker network
3. **Регулярно делайте бэкапы**:
   ```bash
   docker exec postgres_container pg_dump -U snapkit snapkit | gzip > backup_$(date +%Y%m%d).sql.gz
   ```

## Очистка данных

Для очистки старых записей (опционально):

```sql
-- Удалить записи старше 30 дней
DELETE FROM user_screenshots
WHERE created_at < NOW() - INTERVAL '30 days';

-- Vacuum для освобождения места
VACUUM ANALYZE user_screenshots;
```

---

✅ База данных настроена! Теперь `/screenshot` команда должна работать корректно.
