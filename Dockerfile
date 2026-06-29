# ============================================================
# Base Dependencies
# ============================================================
FROM node:22-bookworm AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma

RUN npx prisma generate


# ============================================================
# Development
# ============================================================
FROM base AS development

ENV NODE_ENV=development

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


# ============================================================
# Builder
# ============================================================
FROM base AS builder

COPY . .

RUN npm run build


# ============================================================
# Production
# ============================================================
FROM node:22-bookworm AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["node", "dist/index.js"]