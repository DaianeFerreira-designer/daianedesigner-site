FROM php:8.3-fpm-alpine

RUN apk add --no-cache nginx

WORKDIR /var/www/html

COPY . /var/www/html

COPY nginx.conf /etc/nginx/http.d/default.conf

RUN mkdir -p /run/nginx

EXPOSE 80

CMD php-fpm -D && nginx -g "daemon off;"