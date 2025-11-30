# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    colors.sh                                          :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/02/25 10:06:20 by isibio            #+#    #+#              #
#    Updated: 2025/02/25 10:06:21 by isibio           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

export ITALIC="\033[3m"

export CLEAN="\033[0m"
export BOLD="\033[1m"
export DIM="\033[2m"

export UNDERLINED="\033[4m"
export BLINK="\033[5m"
export INVERTED="\033[7m"
export CLEAR="\r\033[K"

export WHITE="\033[38;5;231m"
export DBEIGE="\033[38;5;173m"
export BEIGE="\033[38;5;216m"
export GRAY="\033[38;5;8m"

export BLUE="\033[38;5;27m"
export LBLUE="\033[38;5;117m"
export LLBLUE="\033[38;2;129;218;227m"
export CYAN="\033[96m"
export YELLOW="\033[38;5;226m"
export LYELLOW="\033[38;2;252;222;112m"
export LLYELLOW="\033[38;2;250;255;175m"
export GREEN="\033[38;5;46m"
export LGREEN="\033[38;5;10m"
export LLGREEN="\033[38;5;120m"
export LORANGE="\033[38;5;209m"
export ORANGE="\033[38;5;214m"
export DORANGE="\033[38;5;208m"
export DDORANGE="\033[38;5;202m"
export PURPLE="\033[38;5;171m"
export PINK="\033[38;5;176m"
export LPINK="\033[38;5;218m"
export BROWN="\033[38;5;130m"
export LBROWN=DBEIGE
export LRED="\033[38;5;203m"
export RED="\033[38;5;1m"
export BRED="\033[31;1m"

echo -e  ${LGREEN}'C' ${LBLUE} 'O' ${LYELLOW} 'L' ${LORANGE} 'O' ${LRED} 'R' ${PINK} 'S' ${CLEAN}

# clear && docker build -t gamefront . && docker run -it gamefront
# docker exec -it $(docker ps | grep gamefront | awk '{print $1;}') /bin/sh
