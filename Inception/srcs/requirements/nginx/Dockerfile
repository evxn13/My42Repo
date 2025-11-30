FROM alpine:3.18

RUN apk update \
 && apk add --no-cache nginx openssl

RUN mkdir -p /run/nginx /etc/nginx/ssl /var/www/html /tmp
RUN mkdir -p /var/www/html && chown -R nginx:nginx /var/www/html && chmod -R 755 /var/www/html

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout /etc/nginx/ssl/selfsigned.key \
	-out /etc/nginx/ssl/selfsigned.crt \
	-subj "/C=FR/ST=PACA/L=Nice/O=42/OU=evscheid/CN=evscheid.42.fr"

RUN chmod -R 755 /var/www/html

# Copying our configuration
COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./tools/handler.sh /tmp/handler.sh

# Handling port replacement
RUN chmod +x /tmp/handler.sh
RUN chmod 644 /etc/nginx/nginx.conf

# Allowing needed port
EXPOSE 443

# Running NGINX in background
CMD ["sh", "/tmp/handler.sh"]