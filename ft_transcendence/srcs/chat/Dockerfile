# ---------------------------------------------------------------------------
# Image : Node.js 20 alpine + outils de build
# path : srcs/chat/Dockerfile
# ---------------------------------------------------------------------------
#	FROM node:20-alpine

	# ---------------------------------------------------------------------------
	# Variables d’environnement
	# ---------------------------------------------------------------------------
#	ENV NODE_ENV=production                       
#	ENV SERVICE_NAME="chat"
#	ENV PROJECT_CODE_DIRECTORY="/var/transcendence-chat"
#	ENV EXPOSED_PORT=8443
	
	# ---------------------------------------------------------------------------
	# Dossier de travail
	# ---------------------------------------------------------------------------
#	WORKDIR ${PROJECT_CODE_DIRECTORY}
	
	# ---------------------------------------------------------------------------
	# Outils natifs requis pour compiler d’éventuelles dépendances
	# ---------------------------------------------------------------------------
#	RUN apk add --no-cache make g++ \
#	 && npm install -g node-gyp
	
	# ---------------------------------------------------------------------------
	# Dépendances NPM (prod uniquement)
	# ---------------------------------------------------------------------------
#	COPY package.json ./
#	RUN npm install --production
	
	# ---------------------------------------------------------------------------
	# Code source
	# ---------------------------------------------------------------------------
#	COPY . ./
	
	# ---------------------------------------------------------------------------
	# Dossier pour la base SQLite
	# ---------------------------------------------------------------------------
#	RUN mkdir -p ${PATH_DB_VOLUME}
	
	# ---------------------------------------------------------------------------
	# Réseau & démarrage
	# ---------------------------------------------------------------------------
#	EXPOSE ${EXPOSED_PORT}
#	CMD ["npm", "start"]
	
	FROM node:23.8.0-alpine

# Genetal
    EXPOSE	8443

# Description variables 
	ENV	SERVICE_NAME="chat"

# Secvice variables (SHOULD NOT BE MODIFIED !!!)
	ARG	HOST_INSTALLER_DIRECTORY=./container_installation
	ARG	CONTAINER_INSTALLER_DIRECTORY=/etc/container_installation
	ARG	CONTAINER_INSTALLER_SCRIPT=/etc/container_installation/wake_up.sh

	# location of the 'srcs' in the container
	ARG	PROJECT_CODE_DIRECTORY=/var/transcendence-chat

	ARG	EXPOSED_PORT=8443

	# -----
	ENV	CONTAINER_INSTALLER_DIRECTORY=$CONTAINER_INSTALLER_DIRECTORY
	ENV	CONTAINER_INSTALLER_SCRIPT=$CONTAINER_INSTALLER_SCRIPT

	ENV	PROJECT_CODE_DIRECTORY=$PROJECT_CODE_DIRECTORY

	ENV DOCKERDEBUG=false

	ENV EXPOSED_PORT=$EXPOSED_PORT

# Genetal
	EXPOSE $EXPOSED_PORT

	RUN apk add --no-cache python3 make g++ libstdc++ # MIGHT NOT NEED THIS

# Preparing the launch of custom scripts (installer) (SHOULD NOT BE MODIFIED !!!)
	RUN		mkdir -p					$PROJECT_CODE_DIRECTORY
	RUN		mkdir -p					$CONTAINER_INSTALLER_DIRECTORY
	WORKDIR								$CONTAINER_INSTALLER_DIRECTORY
	COPY	$HOST_INSTALLER_DIRECTORY	$CONTAINER_INSTALLER_DIRECTORY
	RUN		chmod +x					$CONTAINER_INSTALLER_DIRECTORY/*

# Installing project (code)
	COPY	./server/	$PROJECT_CODE_DIRECTORY

# launching the script
	CMD ["sh", "-c", "$CONTAINER_INSTALLER_SCRIPT"]
		# -c to replace the variable
