FROM node:18-alpine

# Установка системных зависимостей для Sharp
# Sharp требует libvips для высокопроизводительной обработки изображений
RUN apk add --no-cache \
    vips-dev \
    fftw-dev \
    curl

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

# Порт для health check endpoint
EXPOSE 3000

# Health check (каждые 30 секунд, таймаут 10 секунд)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
