/**
 * Менеджер состояний пользователей
 */

// Хранилище состояний (в продакшене использовать Redis)
const userStates = new Map();

/**
 * Получить состояние пользователя
 */
function getState(userId) {
  return userStates.get(userId);
}

/**
 * Установить состояние пользователя
 */
function setState(userId, state) {
  userStates.set(userId, {
    ...state,
    updatedAt: Date.now()
  });
}

/**
 * Удалить состояние пользователя
 */
function clearState(userId) {
  userStates.delete(userId);
}

/**
 * Обновить данные в состоянии
 */
function updateState(userId, data) {
  const currentState = getState(userId) || {};
  setState(userId, {
    ...currentState,
    ...data
  });
}

/**
 * Очистка старых состояний (запускать периодически)
 */
function cleanupOldStates(maxAgeMs = 30 * 60 * 1000) { // 30 минут
  const now = Date.now();
  for (const [userId, state] of userStates.entries()) {
    if (now - state.updatedAt > maxAgeMs) {
      userStates.delete(userId);
    }
  }
}

// Очищать старые состояния каждые 10 минут
setInterval(() => {
  cleanupOldStates();
  console.log(`🧹 Очищены старые состояния. Активных: ${userStates.size}`);
}, 10 * 60 * 1000);

module.exports = {
  getState,
  setState,
  clearState,
  updateState
};
