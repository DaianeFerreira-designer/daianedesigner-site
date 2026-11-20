FROM node:22-alpine AS frontend

WORKDIR /build
RUN npm install --no-audit --no-fund --no-save esbuild@0.25.12 lenis@1.1.18 postcss@8.5.25
COPY index.html style.css script.js ./
COPY scripts/build-frontend.cjs ./
RUN node build-frontend.cjs

FROM php:8.3-fpm-alpine

# Instala extensões necessárias
RUN docker-php-ext-install pdo pdo_mysql

# Erros internos ficam nos logs, inclusive falhas anteriores ao codigo da pagina.
RUN printf '%s\n' 'expose_php=Off' 'display_errors=Off' 'log_errors=On' \
    'session.use_strict_mode=1' 'session.use_only_cookies=1' 'session.cookie_httponly=1' \
    'session.cookie_samesite=Strict' 'post_max_size=64K' 'file_uploads=Off' \
    > /usr/local/etc/php/conf.d/security.ini

RUN apk add --no-cache nginx

WORKDIR /var/www/html

COPY . /var/www/html
COPY --from=frontend /build/dist/ /var/www/html/

COPY nginx.conf /etc/nginx/http.d/default.conf

RUN mkdir -p /run/nginx

EXPOSE 80

CMD php-fpm -D && nginx -g "daemon off;"
