# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/11/28 13:29:56 by evscheid          #+#    #+#              #
#    Updated: 2023/11/28 13:29:56 by evscheid         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME = cub3d
CC = gcc
CFLAGS = -Wall -Wextra -Werror

# Chemins
SRC_DIR = ./src/
OBJ_DIR = ./objs/
MLX_DIR = ./minilibx-linux/

# Fichiers source
SRCS =	main.c control_1.c control_2.c valid_map.c color_init.c \
	player_init.c texture_init.c map_init.c mlx_init.c mlx_rending_1.c \
	mlx_utils.c utils1.c utils2.c utils3.c mlx_rending_2.c mlx_rending_3.c \
	gnl/get_next_line.c gnl/get_next_line_utils.c
SRCS := $(addprefix $(SRC_DIR), $(SRCS))

# Fichiers objets
OBJS = $(SRCS:$(SRC_DIR)%.c=$(OBJ_DIR)%.o)

# Règles
all: $(NAME)

$(NAME): $(OBJS)
	@clear;
	@echo "\033[1m\033[38;5;141mCompilation: \033[1;31mminilibx-linux/mlx\033[0m"
	@$(CC) $(CFLAGS) -o $@ $^ -L$(MLX_DIR) -lmlx -lXext -lX11 -lm
	@clear;
	@echo "\033[38;5;240m───────────────────\033[0m"
	@echo "\033[1m\033[38;5;141mStatus of cub3d\033[0m: [\033[0;32mOK\033[0m]"
	@echo "\033[38;5;240m───────────────────\033[0m"

$(OBJ_DIR)%.o: $(SRC_DIR)%.c | $(OBJ_DIR)
	@clear;
	@echo "\033[1m\033[38;5;141mCompilation: \033[1;31m$<\033[0m"
	@$(CC) $(CFLAGS) -I$(SRC_DIR) -I$(MLX_DIR) -c $< -o $@

$(OBJ_DIR):
	@mkdir -p $(OBJ_DIR)
	@mkdir -p $(dir $(OBJS))

clean:
	@clear;
	@echo "\033[1m\033[38;5;141mCleaning of \033[1;31m$(NAME)\033[0m"
	@rm -rf $(OBJ_DIR)

fclean: clean
	@clear;
	@echo "\033[1m\033[38;5;141mDelete of \033[0;31m$(NAME)\033[0m"
	@rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re
