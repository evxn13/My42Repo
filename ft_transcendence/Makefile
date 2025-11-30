# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/01/09 11:25:21 by isibio            #+#    #+#              #
#    Updated: 2025/01/09 11:25:23 by isibio           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# Colors and styles variables
	CLEAN	= \033[0m
	BOLD	= \033[1m
	CLEAR	= \r\033[K
	BLUE	= \033[38;5;27m
	YELLOW	= \033[38;5;226m
	GRAY	= \033[38;5;8m
	GREEN	= \033[38;5;46m
	ORANGE	= \033[38;5;214m
	WHITE	= \033[38;5;231m
	BK_		= \033[48;5;0m

# Global variables
	# Project variables
	PROJECT_NAME				=pong in paris
	PROJECT_NAME_DISPLAY		=${CLEAN}${WHITE}[${ORANGE}${PROJECT_NAME}${WHITE}]${CLEAN}
	PROJECT_NAME_DISPLAY_UNDONE	=${CLEAN}${WHITE}[${BOLD}${GRAY}${TOTAL_PERCENT_ECHO} files${CLEAN}${WHITE}]${CLEAN}
	PROJECT_NAME_DISPLAY_DONE	=${CLEAN}${WHITE}[${ORANGE}${PROJECT_NAME}${WHITE}]${CLEAN}

	# Other variables
	PROJECT_COMPOSE_PATH		=./compose.yaml

	HOSTNAME					=${shell hostname -s}
	HOSTNAME_ENV_FILE			="./env/hostname.env"
	HOSTNAME_ENV_VARIABLE_NAME	="HOST_TRANSCENDENCE"

all :
	@printf "$(PROJECT_NAME_DISPLAY_UNDONE) $(CLEAN)${WHITE}Creating >> ${HOSTNAME_ENV_FILE} ${CLEAN}" ${notdir $<}
	@if [ ! -f ${HOSTNAME_ENV_FILE} ];																					\
	then																												\
		echo "# env file created by Makefile" >> ${HOSTNAME_ENV_FILE};													\
		echo "${HOSTNAME_ENV_VARIABLE_NAME}=${HOSTNAME}.42nice.fr" >> ${HOSTNAME_ENV_FILE};								\
		echo "VITE_${HOSTNAME_ENV_VARIABLE_NAME}=${HOSTNAME}.42nice.fr" >> ${HOSTNAME_ENV_FILE};						\
	else																												\
		sed -i "s/^${HOSTNAME_ENV_VARIABLE_NAME}=.*/${HOSTNAME_ENV_VARIABLE_NAME}=${HOSTNAME}.42nice.fr/"	${HOSTNAME_ENV_FILE};			\
		sed -i "s/^VITE_${HOSTNAME_ENV_VARIABLE_NAME}=.*/VITE_${HOSTNAME_ENV_VARIABLE_NAME}=${HOSTNAME}.42nice.fr/"	${HOSTNAME_ENV_FILE};	\
	fi
	@printf "$(CLEAR)$(PROJECT_NAME_DISPLAY_DONE) ${WHITE}Created >> ${BOLD}${GREEN}${HOSTNAME_ENV_FILE}  ✓ \n${CLEAN}" ${notdir $<}

clean :
	docker compose -f $(PROJECT_COMPOSE_PATH) down
	@rm -rf	${HOSTNAME_ENV_FILE}

fclean : clean

re : fclean all

run: all
	docker compose -f $(PROJECT_COMPOSE_PATH) up --build

dean :
	@printf "${ORANGE}The Synth GOD${WHITE}\n"

docker-clean:
	docker stop $(docker ps -qa) ; docker rm $(docker ps -qa); docker rmi -f $(docker images -qa); docker volume rm $(docker volume ls -q); docker network rm $(docker network ls -q)

.PHONY : all clean fclean re
