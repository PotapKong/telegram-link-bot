FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ENV BOT_TOKEN=7060066084:AAFliUkwYDoEZk4B0jnKa37zn40v-L9lfYY

CMD ["node", "index.js"]
