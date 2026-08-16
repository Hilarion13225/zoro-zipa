# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Use a build-time API URL so the frontend can be built with the correct backend target.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build React app
RUN npm run build

# Production stage — nginx's official unprivileged image: runs as non-root
# out of the box (unlike the plain nginx:alpine image, which runs as root),
# and the version is pinned instead of following the unpinned "alpine" tag.
FROM nginxinc/nginx-unprivileged:1.27-alpine
WORKDIR /usr/share/nginx/html

# Copy built app from builder
COPY --from=builder --chown=nginx:nginx /app/dist .

# Copy nginx config for SPA and proxy /api to the backend
USER root
RUN echo 'server { \
  listen 8080; \
  server_name _; \
  root /usr/share/nginx/html; \
  index index.html; \
  location /api/ { \
    proxy_pass http://backend:8080; \
    proxy_http_version 1.1; \
    proxy_set_header Host $host; \
    proxy_set_header X-Real-IP $remote_addr; \
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
    proxy_set_header X-Forwarded-Proto $scheme; \
    proxy_set_header Connection ""; \
  } \
  location / { \
    try_files $uri /index.html; \
  } \
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
    expires 1y; \
    add_header Cache-Control "public, immutable"; \
  } \
}' > /etc/nginx/conf.d/default.conf
USER nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
