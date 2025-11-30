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

echo -e 'Good morning from service '"$SERVICE_NAME"' !\n'

echo "adding colors"
	source ./colors.sh
echo -e 'done.\n'

#
# things to do before moving to srcs dir (-> $PROJECT_CODE_DIRECTORY)
#

echo -e ${LORANGE}${BOLD}'moving from:'$(pwd)' to '"$PROJECT_CODE_DIRECTORY"${CLEAN}
cd $PROJECT_CODE_DIRECTORY

#
# things to do after moved to srcs dir
#

# /!\ dans le rendu final cette ligne va devoir etre RETIREE
echo -e ${BRED}'-- SLEEPING INFINITE !--'${CLEAN}
	sleep infinite