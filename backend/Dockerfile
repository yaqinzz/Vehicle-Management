FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY openapi.yaml ./

RUN npm ci

# Generate prisma client and build TypeScript
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy runtime artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/openapi.yaml ./
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 4000

CMD ["node", "dist/server.js"]
