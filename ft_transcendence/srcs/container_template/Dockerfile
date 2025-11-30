# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/01/27 10:33:21 by isibio            #+#    #+#              #
#    Updated: 2025/01/27 10:33:22 by isibio           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM [DOCKER IMAGE]																<- EDIT ICI

# Description variables 
	ENV	SERVICE_NAME=[NOM DU SERVICE]											<- EDIT ICI

# Secvice variables (SHOULD NOT BE MODIFIED !!!)
	ARG	HOST_INSTALLER_DIRECTORY=./container_installation
	ARG	CONTAINER_INSTALLER_DIRECTORY=/etc/container_installation
	ARG	CONTAINER_INSTALLER_SCRIPT=/etc/container_installation/wake_up.sh

	# location of the 'srcs' in the container
	ARG	PROJECT_CODE_DIRECTORY=/var/transcendence-[NOM DU SERVICE]				<- EDIT ICI

	ARG	EXPOSED_PORT=[PORT]														<- EDIT ICI

	# -----
	ENV	CONTAINER_INSTALLER_DIRECTORY=$CONTAINER_INSTALLER_DIRECTORY
	ENV	CONTAINER_INSTALLER_SCRIPT=$CONTAINER_INSTALLER_SCRIPT

	ENV	PROJECT_CODE_DIRECTORY=$PROJECT_CODE_DIRECTORY

	ENV DOCKERDEBUG=false														<- EDIT ICI (optionnel)

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

# Installing project (code)
	COPY	./srcs/	$PROJECT_CODE_DIRECTORY
