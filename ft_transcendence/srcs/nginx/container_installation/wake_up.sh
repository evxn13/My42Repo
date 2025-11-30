# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    wake_up.sh                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/01/27 12:28:33 by isibio            #+#    #+#              #
#    Updated: 2025/01/27 12:28:34 by isibio           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#!/bin/sh

echo -e 'Good morning from service '"$SERVICE_NAME"' !\n'

echo "adding colors"
	source ./colors.sh
echo -e 'done.\n'


echo -e ${LBLUE}${BOLD}'creating SSL certificate :'${CLEAN}
	export SSL_KEY_FILE="${NGINX_VOLUME}/ssl/transendence-selfsigned.key"
	export SSL_CRT_FILE="${NGINX_VOLUME}/ssl/transendence-selfsigned.crt"

	if [ ! -f $SSL_KEY_FILE ] || [ ! -f $SSL_CRT_FILE ];																					\
	then
		mkdir				${NGINX_VOLUME}/ssl
		rm -rf				${NGINX_VOLUME}/ssl/*
		touch				${SSL_KEY_FILE}
		openssl req -x509 -noenc -days 365 -newkey rsa:2048		\
			-keyout	${SSL_KEY_FILE}								\
			-out	${SSL_CRT_FILE}								\
			-subj 	"/CN=${HOST_TRANSCENDENCE}"					\
			-addext	"subjectAltName=DNS:${HOST_TRANSCENDENCE},DNS:localhost,IP:127.0.0.1"
	fi
echo -e ${LGREEN}${BOLD}' '${CLEAN}


echo -e ${LBLUE}${BOLD}'checking nginx version :'${CLEAN}
	echo -e -n ${LLYELLOW}
	nginx -v
echo -e ${LGREEN}${BOLD}' '${CLEAN}

echo -e ${LBLUE}${BOLD}'creating and moving nginx config file :'${CLEAN}
	mkdir -p /var/log/nginx/

	rm -rf /etc/nginx/conf.d/default.conf

	chmod +x create_nginx.conf.sh
	sh create_nginx.conf.sh
	cp ./files/nginx.conf /etc/nginx/nginx.conf
echo -e ${LGREEN}${BOLD}' '${CLEAN}

# Launching nginx
echo -e ${LBLUE}${BOLD}'launching nginx :'${CLEAN}
	nginx -g "daemon off;"
echo -e ${LGREEN}${BOLD}' '${CLEAN}

echo -e ${BRED}'-- SLEEPING INFINITE !--'${CLEAN}
	sleep infinite