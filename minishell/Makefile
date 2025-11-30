# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: rheyer <rheyer@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/05/11 18:36:18 by evscheid          #+#    #+#              #
#    Updated: 2023/07/09 20:21:44 by rheyer           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

SRCS =	src/main.c 						\
		src/minishell.c					\
		src/minishell_utils.c			\
		src/lexer.c 					\
		src/parser1.c					\
		src/parser2.c 					\
		src/parser_utils.c 				\
		src/execve.c					\
		src/utils1.c					\
		src/utils2.c					\
		src/utils3.c					\
		src/utils4.c					\
		src/utils5.c					\
		src/utils6.c					\
		src/utils7.c 					\
		src/utils8.c 					\
		src/utils9.c					\
		src/utils10.c					\
		src/utils11.c					\
		src/utils12.c					\
		src/utils13.c					\
		src/utils14.c					\
		src/utils15.c					\
		src/ft_export.c					\
		src/ft_export_utils.c			\
		src/ft_unset.c 					\
		src/ft_echo.c					\
		src/ft_cd.c 					\
		src/ft_cd_utils.c 				\
		src/ft_exit.c 					\
		src/ft_pwd.c 					\
		src/basic_env.c 				\
		src/exec.c 						\
		src/exec_utils1.c 				\
		src/redirect1.c					\
		src/redirect1_utils.c 			\
		src/redirect2.c					\
		src/redirect2_utils.c			\

OBJS =	${SRCS:.c=.o}

NAME = minishell

READLINE_PATH = ~/.brew/opt/readline

CFLAGS = -Wall -Wextra -Werror -I $(READLINE_PATH)/include -g
LDFLAGS = -L $(READLINE_PATH)/lib -lreadline

TOTAL_FILES := $(words $(SRCS))
CURR_FILE = 1

define print_progress
	@progress=$$((($(CURR_FILE) * 100) / $(TOTAL_FILES))); \
	printf "Compiling: ["; \
	completed=$$((progress / 5)); \
	for i in $$(seq 1 $$completed); do \
		printf "█"; \
	done; \
	for i in $$(seq $$((completed + 1)) 20); do \
		printf " "; \
	done; \
	printf "] %3d%% ($(CURR_FILE)/$(TOTAL_FILES))" $$progress
	@echo "\033[A" 
endef

.c.o:
	@$(call print_progress)
	@gcc $(CFLAGS) -c $< -o ${<:.c=.o}
	@$(eval CURR_FILE = $(shell echo $$(($(CURR_FILE) + 1))))

all: $(NAME)

$(NAME): $(OBJS)
	@echo "Compiling: [███████████████████] 100% ($(TOTAL_FILES)/$(TOTAL_FILES))"
	@ar rcs minishell.a $(OBJS)
	@gcc -o $(NAME) minishell.a $(LDFLAGS)

clean:
	@rm -f src/*.o

fclean: clean
	@rm -f minishell.a $(NAME)

re: fclean all