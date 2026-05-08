# Этап сборки
FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем ВСЕ зависимости (включая devDependencies)
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Копируем исходный код
COPY . .

# Собираем production-версию
RUN npm run build

# Этап запуска
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80