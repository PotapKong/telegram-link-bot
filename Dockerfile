FROM node:18-alpine

# Установка системных зависимостей для Canvas и Sharp
# Canvas (будет удалено после миграции на Sharp)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    # Sharp dependencies
    vips-dev \
    fftw-dev

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

CMD ["npm", "start"]
