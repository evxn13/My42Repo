# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tpicoule <tpicoule@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/01/27 10:33:21 by isibio            #+#    #+#              #
#    Updated: 2025/06/16 12:20:59 by tpicoule         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:23.8.0-alpine

# Description variables 
	ENV	SERVICE_NAME="frontend"

# Secvice variables (SHOULD NOT BE MODIFIED !!!)
	ARG	HOST_INSTALLER_DIRECTORY=./container_installation
	ARG	CONTAINER_INSTALLER_DIRECTORY=/etc/container_installation
	ARG	CONTAINER_INSTALLER_SCRIPT=/etc/container_installation/wake_up.sh

	# location of the 'srcs' in the container
	ARG	PROJECT_CODE_DIRECTORY=/var/transcendence-frontend

	ARG	EXPOSED_PORT=8550

	# -----
	ENV	CONTAINER_INSTALLER_DIRECTORY=$CONTAINER_INSTALLER_DIRECTORY
	ENV	CONTAINER_INSTALLER_SCRIPT=$CONTAINER_INSTALLER_SCRIPT

	ENV	PROJECT_CODE_DIRECTORY=$PROJECT_CODE_DIRECTORY

	ENV DOCKERDEBUG=false
	ENV VITE_DOCKERDEBUG=$DOCKERDEBUG

	ENV EXPOSED_PORT=$EXPOSED_PORT

# Genetal
	EXPOSE $EXPOSED_PORT

# Preparing the launch of custom scripts (installer) (SHOULD NOT BE MODIFIED !!!)
	RUN		mkdir -p					$PROJECT_CODE_DIRECTORY
	RUN		mkdir -p					$CONTAINER_INSTALLER_DIRECTORY
	WORKDIR								$CONTAINER_INSTALLER_DIRECTORY
	COPY	$HOST_INSTALLER_DIRECTORY	$CONTAINER_INSTALLER_DIRECTORY
	RUN		chmod +x					$CONTAINER_INSTALLER_DIRECTORY/*

	# launching the script
	CMD ["sh", "-c", "$CONTAINER_INSTALLER_SCRIPT"]
		# -c to replace the variable

# Installing packages
	# RUN apk add --no-cache [package]

# Installing project (code)
	COPY	./srcs/	$PROJECT_CODE_DIRECTORY