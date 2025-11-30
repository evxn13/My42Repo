# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    wake_up.sh                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/01/27 12:28:33 by isibio            #+#    #+#              #
#    Updated: 2025/06/04 16:38:20 by rbulanad         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

echo -e 'Good morning from service '"$SERVICE_NAME"' !\n'

echo "adding colors"
	source ./colors.sh
echo -e 'done.\n'

echo -e ${LBLUE}${BOLD}'checking Node version :'${CLEAN}
	echo -e -n ${LLYELLOW}'-> ' ; node --version
echo -e ${LGREEN}${BOLD}' '${CLEAN}


echo -e ${LORANGE}${BOLD}'moving from:'$(pwd)' to '"$PROJECT_CODE_DIRECTORY/game"${CLEAN}
cd $PROJECT_CODE_DIRECTORY/game

echo -e ${LBLUE}${BOLD}'installing packages (via npm from package.json) :'${CLEAN}
	echo -e -n ${CLEAN}
	npm install
echo -e ${LGREEN}${BOLD}' '${CLEAN}

echo -e ${LORANGE}${BOLD}'moving from:'$(pwd)' to '"$PROJECT_CODE_DIRECTORY/account"${CLEAN}
cd $PROJECT_CODE_DIRECTORY/account

echo -e ${LBLUE}${BOLD}'installing packages (via npm from package.json) :'${CLEAN}
	echo -e -n ${CLEAN}
	npm install
echo -e ${LGREEN}${BOLD}' '${CLEAN}

# echo -e ${LBLUE}${BOLD}'launching project at ['"$PROJECT_CODE_DIRECTORY"'/main.js] :'${CLEAN}
# 	# echo -e -n ${LLYELLOW}
# 	node $PROJECT_CODE_DIRECTORY/main.js
# echo -e ${LGREEN}${BOLD}' '${CLEAN}

echo -e ${LORANGE}${BOLD}'moving from:'$(pwd)' to '"$PROJECT_CODE_DIRECTORY/website"${CLEAN}
cd $PROJECT_CODE_DIRECTORY/website

echo -e ${LBLUE}${BOLD}'installing packages (via npm from package.json) :'${CLEAN}
	echo -e -n ${CLEAN}
	npm install
echo -e ${LGREEN}${BOLD}' '${CLEAN}

echo -e ${LBLUE}${BOLD}'launching project at ['"$PROJECT_CODE_DIRECTORY"'] with npm :'${CLEAN}
	npm run dev -- --host
echo -e ${LGREEN}${BOLD}' '${CLEAN}

echo -e ${BRED}'-- SLEEPING INFINITE !--'${CLEAN}
	sleep infinite