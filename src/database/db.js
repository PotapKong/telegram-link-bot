/**
 * PostgreSQL Database Connection
 */

const { Pool } = require('pg');

// Создаем пул соединений
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Или через отдельные параметры:
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20, // максимум соединений в пуле
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Обработка ошибок пула
pool.on('error', (err) => {
  console.error('❌ Неожиданная ошибка PostgreSQL:', err);
});

/**
 * Выполнить SQL запрос
 */
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`📊 SQL выполнен за ${duration}ms:`, text.substring(0, 50));
    return res;
  } catch (error) {
    console.error('❌ Ошибка SQL запроса:', error);
    throw error;
  }
}

/**
 * Получить клиента из пула для транзакций
 */
async function getClient() {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  // Переопределяем release для логирования
  client.release = () => {
    client.query = query;
    client.release = release;
    return release.apply(client);
  };

  return client;
}

/**
 * Проверка подключения к БД
 */
async function healthCheck() {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ PostgreSQL подключен:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL недоступен:', error.message);
    return false;
  }
}

/**
 * Инициализация БД (выполнить схему если нужно)
 */
async function initialize() {
  try {
    await healthCheck();
    console.log('✅ База данных инициализирована');
  } catch (error) {
    console.error('❌ Ошибка инициализации БД:', error);
    throw error;
  }
}

/**
 * Закрыть все соединения
 */
async function close() {
  await pool.end();
  console.log('📴 Соединения с PostgreSQL закрыты');
}

module.exports = {
  query,
  getClient,
  healthCheck,
  initialize,
  close,
  pool
};
