FROM --platform=$BUILDPLATFORM node:18-bullseye-slim AS builder

WORKDIR /usr/src/app

# Install system build deps required to compile native modules (sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 \
  python3-dev \
  build-essential \
  pkg-config \
  libsqlite3-dev \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV npm_config_python=/usr/bin/python3

# install deps and build
COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .
RUN npm run build
# remove devDependencies so only production deps remain
RUN npm prune --production

FROM node:18-bullseye-slim
WORKDIR /usr/src/app
ENV NODE_ENV=production

# runtime dependencies for sqlite3
RUN apt-get update && apt-get install -y --no-install-recommends \
  libsqlite3-0 \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
# Copy preinstalled production node_modules from builder (avoids running npm in final image)
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# ensure data directory exists and is writable
RUN mkdir -p /usr/src/app/data
VOLUME ["/usr/src/app/data"]

EXPOSE 4000
CMD ["node", "dist/index.js"]
