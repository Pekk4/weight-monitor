FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# install deps and build static assets
COPY package.json package-lock.json* ./
# Prefer `npm ci` for reproducible installs, but fall back to `npm install`
RUN npm ci || npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# Copy built static site to nginx html directory
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Use custom nginx configuration to proxy /api to the server container
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
