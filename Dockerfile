FROM node:18-alpine

# Установка системных зависимостей для Sharp
# Sharp требует libvips для высокопроизводительной обработки изображений
RUN apk add --no-cache \
    vips-dev \
    fftw-dev

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

CMD ["npm", "start"]
