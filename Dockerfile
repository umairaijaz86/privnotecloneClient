# ===== Build the Vite app =====
FROM node:18-alpine AS webbuild
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Pass an API base at build-time if you like; default to http://localhost:3000
ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ===== Nginx to serve the built app =====
FROM nginx:1.25-alpine

# React Router fallback to index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static files
COPY --from=webbuild /app/dist /usr/share/nginx/html
WORKDIR /app

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
