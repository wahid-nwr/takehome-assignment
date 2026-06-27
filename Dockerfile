# -----------------------------
# Base
# -----------------------------
FROM node:22-slim AS base

WORKDIR /app

COPY package*.json ./

# -----------------------------
# Development
# -----------------------------
FROM base AS development

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# -----------------------------
# Builder
# -----------------------------
FROM base AS builder

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

# -----------------------------
# Production
# -----------------------------
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN addgroup -S nodejs && \
    adduser -S nodejs -G nodejs

USER nodejs

EXPOSE 3000

CMD ["node", "dist/server.js"]