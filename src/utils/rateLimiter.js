/**
 * Rate Limiter - защита от спама и abuse
 * Ограничивает количество запросов от пользователя в единицу времени
 */

// Хранилище лимитов: userId -> { count, resetAt, blockedUntil }
const limits = new Map();

// Очистка старых записей каждые 5 минут
setInterval(
  () => {
    const now = Date.now();
    for (const [userId, data] of limits.entries()) {
      if (now > data.resetAt && (!data.blockedUntil || now > data.blockedUntil)) {
        limits.delete(userId);
      }
    }
  },
  5 * 60 * 1000
);

/**
 * Проверить rate limit для пользователя
 *
 * @param {number} userId - ID пользователя
 * @param {Object} options - Настройки лимита
 * @param {number} options.maxRequests - Максимум запросов (default: 5)
 * @param {number} options.windowMs - Окно времени в мс (default: 60000 = 1 мин)
 * @param {number} options.blockDurationMs - Время блокировки при превышении (default: 5 мин)
 * @returns {Object} { allowed: boolean, remaining: number, resetIn: number, message?: string }
 */
function checkLimit(userId, options = {}) {
  const {
    maxRequests = 5,
    windowMs = 60 * 1000, // 1 минута
    blockDurationMs = 5 * 60 * 1000 // 5 минут
  } = options;

  const now = Date.now();
  let userLimit = limits.get(userId);

  // Проверка блокировки
  if (userLimit?.blockedUntil && now < userLimit.blockedUntil) {
    const waitSeconds = Math.ceil((userLimit.blockedUntil - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetIn: waitSeconds,
      message: `⛔ Слишком много запросов! Подожди ${formatTime(waitSeconds)}.`
    };
  }

  // Инициализация или сброс окна
  if (!userLimit || now > userLimit.resetAt) {
    userLimit = {
      count: 0,
      resetAt: now + windowMs,
      blockedUntil: null
    };
    limits.set(userId, userLimit);
  }

  // Проверка лимита
  if (userLimit.count >= maxRequests) {
    // Превышение лимита - блокировка
    userLimit.blockedUntil = now + blockDurationMs;
    limits.set(userId, userLimit);

    const waitSeconds = Math.ceil(blockDurationMs / 1000);
    console.log(`⛔ Rate limit exceeded for user ${userId}, blocked for ${waitSeconds}s`);

    return {
      allowed: false,
      remaining: 0,
      resetIn: waitSeconds,
      message: `⛔ Превышен лимит запросов! Заблокирован на ${formatTime(waitSeconds)}.`
    };
  }

  // Увеличить счётчик
  userLimit.count++;
  limits.set(userId, userLimit);

  const remaining = maxRequests - userLimit.count;
  const resetIn = Math.ceil((userLimit.resetAt - now) / 1000);

  return {
    allowed: true,
    remaining,
    resetIn,
    message: remaining <= 1 ? `⚠️ Осталось ${remaining} запрос.` : null
  };
}

/**
 * Получить статистику по лимитам
 */
function getStats() {
  return {
    totalUsers: limits.size,
    limits: Array.from(limits.entries()).map(([userId, data]) => ({
      userId,
      count: data.count,
      resetAt: new Date(data.resetAt).toISOString(),
      blockedUntil: data.blockedUntil ? new Date(data.blockedUntil).toISOString() : null
    }))
  };
}

/**
 * Сбросить лимит для пользователя (для админов)
 */
function resetLimit(userId) {
  const existed = limits.has(userId);
  limits.delete(userId);
  console.log(`🔄 Rate limit reset for user ${userId}`);
  return existed;
}

/**
 * Форматировать время для сообщения
 */
function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds} сек`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} мин`;
}

module.exports = {
  checkLimit,
  getStats,
  resetLimit
};
