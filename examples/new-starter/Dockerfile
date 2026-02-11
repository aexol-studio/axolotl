# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY backend/src/prisma/schema.prisma ./backend/src/prisma/schema.prisma
COPY prisma.config.ts ./

# Skip Prisma postinstall hook - we'll generate after full copy
RUN npm ci --ignore-scripts

COPY . .

# Generate Prisma client once with full context
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/lib ./lib
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend/src/prisma/generated ./backend/src/prisma/generated
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/backend/src/prisma/schema.prisma ./backend/src/prisma/
COPY --from=builder /app/backend/src/prisma/migrations ./backend/src/prisma/migrations
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/backend/schema.graphql ./backend/

EXPOSE 4102

CMD ["node", "lib/index.js"]
