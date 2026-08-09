#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Zoro Zipa Docker Startup Script${NC}\n"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env created. Please edit it with your configuration.${NC}"
        echo -e "${YELLOW}📝 Edit .env and set MAIL_USERNAME and MAIL_PASSWORD${NC}\n"
    else
        echo -e "${RED}❌ .env.example not found!${NC}"
        exit 1
    fi
fi

# Create directories if they don't exist
mkdir -p data uploads

echo -e "${YELLOW}📦 Building Docker images...${NC}"
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}\n"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${YELLOW}🐳 Starting containers...${NC}"
docker-compose up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Containers started${NC}\n"
else
    echo -e "${RED}❌ Failed to start containers${NC}"
    exit 1
fi

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check if backend is running
if docker-compose ps | grep -q "zoro-zipa-backend.*Up"; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    docker-compose logs backend
    exit 1
fi

echo -e "\n${GREEN}🎉 Zoro Zipa is now running!${NC}\n"
echo -e "Frontend:  ${GREEN}http://localhost:3000${NC}"
echo -e "Backend:   ${GREEN}http://localhost:8080${NC}"
echo -e "Uploads:   ${GREEN}http://localhost:80/uploads${NC}\n"
echo -e "${YELLOW}📊 View logs: docker-compose logs -f${NC}"
echo -e "${YELLOW}🛑 Stop: docker-compose down${NC}\n"
