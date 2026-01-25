# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy compiled backend (lib/) and frontend (dist/)
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/dist ./dist

# Copy Prisma generated client (at src/generated/prisma per schema output)
COPY --from=builder /app/src/generated ./src/generated

# Copy node_modules and package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Copy Prisma schema for runtime migrations
COPY --from=builder /app/prisma/schema.prisma ./prisma/

# Copy prisma.config.ts and env.ts for Prisma CLI at runtime
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/src/env.ts ./src/

# Copy and setup entrypoint
COPY --from=builder /app/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

EXPOSE 4102

CMD ["./entrypoint.sh"]
