// Конфигурация приложения
const config = {
  botToken: process.env.BOT_TOKEN,

  // Проверка наличия обязательных переменных
  validate() {
    if (!this.botToken) {
      console.error('❌ ОШИБКА: BOT_TOKEN не установлен в переменных окружения!');
      process.exit(1);
    }
    return true;
  }
};

module.exports = config;
