#!/bin/sh
sed -i "s/wordpress:9000/wordpress:$WP_PORT/g" /etc/nginx/nginx.conf
nginx -g "daemon off;"
