# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer-cached unless package.json changes)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Serve with nginx ─────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config: serve SPA with fallback to index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run injects PORT env var; nginx must listen on it
# Using envsubst so we don't hardcode the port
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
