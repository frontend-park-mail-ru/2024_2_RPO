# Сборка
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Сервер
FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
RUN nginx -t
COPY sw.js /usr/share/nginx/html/
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./static /usr/share/nginx/html/static
EXPOSE 8880
CMD ["nginx", "-g", "daemon off;"]
