# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    create_nginx.conf.sh                               :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/02/28 17:48:36 by isibio            #+#    #+#              #
#    Updated: 2025/06/28 15:35:16 by rbulanad         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#!/bin/sh
echo "creating file"

cat > ./files/nginx.conf << EOF

# /etc/nginx/nginx.conf

worker_processes    auto;
user                nginx;

# Configures default error logger.
error_log /var/log/nginx/error.log warn;

# Include files with config snippets into the root context.
include /etc/nginx/conf.d/*.conf;

events {}

http {
    include /etc/nginx/mime.types;

    upstream frontend
    {
        server frontend:$PORT_FRONTEND;
    }

	upstream fastity-account
	{
		server	fastify-account;
	}

	upstream game_backend
	{
		server	game_backend:$PORT_GAME_BACKEND;
	}

    upstream chat_ws
    {
        server	chat:$PORT_CHAT_HTTPS;
    }

	server
	{
		include /etc/nginx/mime.types;

		listen		$PORT_NGINX ssl;

		# ---------- Fastify Routes ------------------------------------------
		
		location ~ ^/api/(.*)$ {
			rewrite ^/api/(.*)$ /\$1 break;
			proxy_http_version	1.1;
			proxy_pass			https://fastify-account:$PORT_FASTIFY;
			proxy_set_header	Host				\$host;
			proxy_set_header	X-Real-IP			\$remote_addr;
			proxy_set_header	X-Forwarded-For		\$proxy_add_x_forwarded_for;
			proxy_set_header	X-Forwarded-Proto	\$scheme;
			proxy_set_header	Upgrade				\$http_upgrade;
			proxy_set_header	Connection			"upgrade";
		}

		# ---------- Chat Routes ------------------------------------------

		location ~ ^/req/(.*)$ {
			rewrite ^/req/(.*)$ /\$1 break;
			proxy_http_version	1.1;
			proxy_pass			https://chat:$PORT_CHAT_HTTPS;
			proxy_set_header	Host				\$host;
			proxy_set_header	X-Real-IP			\$remote_addr;
			proxy_set_header	X-Forwarded-For		\$proxy_add_x_forwarded_for;
			proxy_set_header	X-Forwarded-Proto	\$scheme;
			proxy_set_header	Upgrade				\$http_upgrade;
			proxy_set_header	Connection			"upgrade";
		}

		# ---------- WebSocket Chat ------------------------------------------
        
		location /ws-chat {
			proxy_http_version	1.1;
			proxy_pass			https://chat_ws;

			proxy_ssl_verify	off;

			proxy_set_header	Host				\$host;
			proxy_set_header	X-Real-IP			\$remote_addr;
			proxy_set_header	X-Forwarded-For		\$proxy_add_x_forwarded_for;
			proxy_set_header	X-Forwarded-Proto	\$scheme;
			proxy_set_header	Upgrade				\$http_upgrade;
			proxy_set_header	Connection			"upgrade";

			proxy_read_timeout 14400s;
			proxy_send_timeout 14400s;

		}

		location ~ ^/game_backend {
			proxy_http_version	1.1;
			proxy_pass			https://game_backend;

			proxy_ssl_verify	off;

			proxy_set_header	Host				\$host;
			proxy_set_header	X-Real-IP			\$remote_addr;
			proxy_set_header	X-Forwarded-For		\$proxy_add_x_forwarded_for;
			proxy_set_header	X-Forwarded-Proto	\$scheme;
			proxy_set_header	Upgrade				\$http_upgrade;
			proxy_set_header	Connection			"upgrade";

			proxy_read_timeout 14400s;
			proxy_send_timeout 14400s;
		}

		location /
		{
			proxy_http_version	1.1;
			proxy_pass			http://frontend;
			proxy_set_header	Host				\$host;
			proxy_set_header	X-Real-IP			\$remote_addr;
			proxy_set_header	X-Forwarded-For		\$proxy_add_x_forwarded_for;
			proxy_set_header	X-Forwarded-Proto	\$scheme;
			proxy_set_header	Upgrade				\$http_upgrade;
			proxy_set_header	Connection			"upgrade";
		}

  		ssl_certificate			$SSL_CRT_FILE;
		ssl_certificate_key		$SSL_KEY_FILE;
		ssl_protocols			TLSv1.3 TLSv1.2;

        # root /var/www/html;
        # index index.php index.html index.htm;
    }
}
EOF

echo "done"
echo "✅ nginx.conf généré avec succès dans ./files/nginx.conf"
