FROM node:22-alpine AS assets

WORKDIR /build
RUN npm install --no-save --no-package-lock --no-audit --no-fund esbuild@0.25.12
COPY index.html style.css script.js ./
COPY scripts/minificar-home.cjs ./
RUN node minificar-home.cjs

FROM php:8.3-fpm-alpine

# Instala extensões necessárias
RUN docker-php-ext-install pdo pdo_mysql

RUN apk add --no-cache nginx

WORKDIR /var/www/html

COPY . /var/www/html
COPY --from=assets /build/index.html /build/style.css /build/script.js /var/www/html/

COPY nginx.conf /etc/nginx/http.d/default.conf

RUN mkdir -p /run/nginx

EXPOSE 80

CMD php-fpm -D && nginx -g "daemon off;"