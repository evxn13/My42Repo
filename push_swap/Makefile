# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/04/05 22:44:57 by evscheid          #+#    #+#              #
#    Updated: 2023/05/14 20:09:46 by evscheid         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME = push_swap

SOURCES = push_swap.c main.c small_sort.c parsing.c radix.c push_swap_utils.c push_swap_utils_2.c command.c algo_utils.c check_int_limits.c

OBJECTS = ${SOURCES:.c=.o}

RM = rm -f
CC = gcc # -g -fsanitize=address
CFLAGS = -Wall -Wextra -Werror 

.c.o:
	${CC} ${CFLAGS} -c $< -o ${<:.c=.o}

all: ${NAME}

${NAME}: ${OBJECTS}
	@make -C ft_printf
	${CC} ${CFLAGS} ${OBJECTS} -o ${NAME} ft_printf/libftprintf.a

clean:
	@make clean -C ft_printf
	${RM} ${OBJECTS}

fclean: clean
	@make fclean -C ft_printf
	${RM} ${NAME}
re: fclean all

.PHONY: all clean fclean re
