# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/02/01 23:12:34 by evscheid          #+#    #+#              #
#    Updated: 2023/06/20 18:28:49 by evscheid         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

SRCS = background.c contour.c init.c keypress.c main.c mlx_setup.c \
       parse_hauteur.c parse_longueur.c player_setup.c \
       press_a.c press_d.c press_w.c press_s.c print_bottom_wall.c \
       print_floor.c print_image.c print_left_wall.c print_player.c \
       print_right_wall.c print_top_wall.c set_collectible.c \
       set_exit.c set_obstacle.c parse_map.c path_find.c \
	   check_map.c 

OBJS = $(SRCS:.c=.o)

RM      =       rm -f

LIB     =       libso_long.a

CFLAGS  =       -Wall -Wextra -Werror 

FRAMEWORK       = -framework OpenGl -framework AppKit

LIB_PATH = -lmlx -L /usr/local/lib/ -L./lib/libft -l ft -L./lib/ft_printf -l ftprintf

NAME = so_long

.SILENT: $(OBJ)

.c.o:
	@gcc ${CFLAGS} -I /usr/local/include/ -c $< -o $@ 

all: $(NAME)

$(NAME): $(OBJS)
	@clear
	@echo "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
	@cat image/chargement.txt
	@make -C lib/libft
	@make -C lib/gnl
	@make -C lib/ft_printf
	@clear
	@gcc ${CFLAGS} $(OBJS) ./lib/gnl/libftgnl.a -I /usr/local/include/ ${FRAMEWORK} ${LIB_PATH} -o ${NAME}
	@cat image/amoung_us.txt
	@echo "\n"

clean:
	@make clean -C lib/libft
	@make clean -C lib/gnl
	@make clean -C lib/ft_printf
	@${RM} ${OBJS}

fclean: clean
	@make fclean -C lib/libft
	@make fclean -C lib/gnl
	@make fclean -C lib/ft_printf
	@${RM} ${NAME} ${LIB}

re: fclean all

.PHONY: all clean flcean re
