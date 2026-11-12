FROM node:22-alpine AS frontend

WORKDIR /build
RUN npm install --no-audit --no-fund --no-save esbuild@0.25.12 lenis@1.1.18
COPY index.html style.css script.js ./
COPY scripts/build-frontend.cjs ./
RUN node build-frontend.cjs

FROM php:8.3-fpm-alpine

# Instala extensões necessárias
RUN docker-php-ext-install pdo pdo_mysql

RUN apk add --no-cache nginx

WORKDIR /var/www/html

COPY . /var/www/html
COPY --from=frontend /build/dist/ /var/www/html/

COPY nginx.conf /etc/nginx/http.d/default.conf

RUN mkdir -p /run/nginx

EXPOSE 80

CMD php-fpm -D && nginx -g "daemon off;"
