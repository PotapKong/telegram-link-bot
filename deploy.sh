#!/bin/bash

# Скрипт для деплоя Telegram Link Bot
# Использование: ./deploy.sh [branch_name]

set -e

BRANCH=${1:-claude/project-analysis-telegram-bot-011CUg8gxis3utvMY4n4viqV}
COMPOSE_FILE="docker-compose.override.yml"

echo "🚀 Starting deployment process..."
echo "📦 Branch: $BRANCH"
echo ""

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with BOT_TOKEN"
    echo "Example: echo 'BOT_TOKEN=your_token_here' > .env"
    exit 1
fi

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker not found!"
    echo "Please install Docker first"
    exit 1
fi

# Проверка наличия Docker Compose
if ! command -v docker compose &> /dev/null; then
    echo "❌ Error: Docker Compose not found!"
    echo "Please install Docker Compose first"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Git операции
echo "📥 Fetching latest changes..."
git fetch origin "$BRANCH"

echo "🔄 Checking out branch..."
git checkout "$BRANCH"

echo "⬇️  Pulling latest changes..."
git pull origin "$BRANCH"

echo ""
echo "🛑 Stopping existing containers..."
docker compose down

echo ""
echo "🏗️  Building new image..."
docker compose build telegram-link-bot

echo ""
echo "🚀 Starting container..."
docker compose up -d telegram-link-bot

echo ""
echo "⏳ Waiting for container to start..."
sleep 3

echo ""
echo "📊 Container status:"
docker compose ps telegram-link-bot

echo ""
echo "📋 Recent logs:"
docker compose logs --tail=20 telegram-link-bot

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📌 Useful commands:"
echo "   View logs:    docker compose logs -f telegram-link-bot"
echo "   Stop bot:     docker compose stop telegram-link-bot"
echo "   Restart bot:  docker compose restart telegram-link-bot"
echo "   Status:       docker compose ps telegram-link-bot"
echo ""
