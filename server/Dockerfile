FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# install dev deps to build TypeScript
COPY package.json package-lock.json* ./
# Prefer `npm ci` for reproducible installs, but fall back to `npm install`
RUN npm ci || npm install

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package.json package-lock.json* ./
# For production, prefer `npm ci --production` but fall back to `npm install --production`
RUN npm ci --production || npm install --production

COPY --from=builder /usr/src/app/dist ./dist

# ensure data directory exists and is writable
RUN mkdir -p /usr/src/app/data
VOLUME ["/usr/src/app/data"]

EXPOSE 4000
CMD ["node", "dist/index.js"]
