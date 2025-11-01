// Конфигурация приложения
const config = {
  botToken: process.env.BOT_TOKEN,

  // Проверка наличия обязательных переменных
  validate() {
    if (!this.botToken) {
      console.error('ERROR: BOT_TOKEN is not set in environment variables!');
      process.exit(1);
    }
    return true;
  }
};

module.exports = config;
