# Build stage
FROM node:18-alpine AS builder

WORKDIR /app/doc/api

COPY doc/api/package*.json ./

RUN npm ci

COPY doc/api .

# Production stage
FROM node:18-alpine AS production

WORKDIR /app/doc/api

COPY doc/api/package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/doc/api .

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

CMD ["node", "src/index.js"]