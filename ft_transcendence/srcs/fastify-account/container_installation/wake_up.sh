# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    wake_up.sh                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/01/27 12:28:33 by isibio            #+#    #+#              #
#    Updated: 2025/06/27 11:07:53 by rbulanad         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

echo -e 'Good morning from service '"$SERVICE_NAME"' !\n'

echo "adding colors"
	source ./colors.sh
echo -e 'done.\n'

echo -e ${LBLUE}${BOLD}'checking Node version :'${CLEAN}
	echo -e -n ${LLYELLOW}'-> ' ; node --version
echo -e ${LGREEN}${BOLD}' '${CLEAN}

echo -e ${LORANGE}${BOLD}'moving from:'$(pwd)' to '"$PROJECT_CODE_DIRECTORY"${CLEAN}
cd $PROJECT_CODE_DIRECTORY

if [ ! -d "node_modules" ]; then
    echo -e ${LGREEN}${BOLD}'node_modules not found, installing dependencies...'${CLEAN}
    npm install
else
    echo -e ${LBLUE}${BOLD}'node_modules found, skipping npm install.'${CLEAN}
fi

while [ ! -f "$PATH_DB_VOLUME/database.db" ]; do
	echo -e ${LLYELLOW}${BOLD}'FASTIFY Waiting for database file to be available.'${CLEAN}
    sleep 1
done
echo -e ${LGREEN}${BOLD}'FASTIFY Database file is available !'${CLEAN}

echo -e ${LBLUE}${BOLD}'launching project at ['"$PROJECT_CODE_DIRECTORY"'/main.js] :'${CLEAN}
	node $PROJECT_CODE_DIRECTORY/main.js
echo -e ${LGREEN}${BOLD}' '${CLEAN}

echo -e ${BRED}'-- SLEEPING INFINITE !--'${CLEAN}
	sleep infinite
