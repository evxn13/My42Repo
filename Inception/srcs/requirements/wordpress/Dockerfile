FROM alpine:3.18

# dépendances (PHP 8.1 explicitement)
RUN apk update && apk add --no-cache \
    php81 php81-fpm php81-mysqli php81-json php81-phar php81-dom php81-curl php81-mbstring \
    wget unzip mariadb-client curl

# mémoire PHP pour éviter les erreurs de WP-CLI
RUN echo "memory_limit=512M" >> /etc/php81/php.ini

# répertoire web
RUN mkdir -p /var/www/html && chown -R nobody:nobody /var/www/html && chmod -R 755 /var/www/html

# PHP-FPM (chemin corrigé pour PHP 8.1)
COPY conf/www.conf /etc/php81/php-fpm.d/www.conf

# configuration
COPY tools/configure.sh /configure.sh
RUN chmod +x /configure.sh

# Port 
EXPOSE 9000

# démarrage
CMD ["/configure.sh"]
