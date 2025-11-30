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

echo -e ${BOLD}${LGREEN}'-> sleeping to keep volume alive'${CLEAN}
	sleep infinite
