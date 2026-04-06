FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init

#  Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && \
    cp -R node_modules /tmp/prod_modules && \
    npm ci

#  Development
FROM deps AS development
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["dumb-init", "npm", "run", "start:dev"]

#  Build
FROM deps AS builder
COPY . .
RUN npm run build

#  Production
FROM base AS production
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=deps /tmp/prod_modules ./node_modules

EXPOSE 3000
USER node
CMD ["dumb-init", "node", "dist/main"]