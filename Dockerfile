# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and workspace package files
COPY package.json package-lock.json* ./
COPY web/package.json web/package.json* ./
COPY mobile/package.json mobile/package.json* ./
COPY shared ./shared

# Install dependencies for web
WORKDIR /app/web
RUN npm install

# Copy web source and configuration
COPY web ./

# Build production distribution
RUN npm run build

# Production Stage with Nginx
FROM nginx:alpine AS runner

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from builder
COPY --from=builder /app/web/dist /usr/share/nginx/html

EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
