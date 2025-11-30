# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/03/02 01:58:11 by evscheid          #+#    #+#              #
#    Updated: 2023/04/07 15:01:12 by evscheid         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# .SILENT: $(OBJ)

all:
	@cd ft_printf && make all
	@gcc -Wall -Wextra -Werror src/server.c ft_printf/libftprintf.a -o server
	@gcc -Wall -Wextra -Werror src/client.c ft_printf/libftprintf.a -o client

clean:
	@cd ft_printf && make clean
	@rm -f server
	@rm -f client

bonus:
	@gcc -Wall -Wextra -Werror "src bonus/server_bonus.c" ft_printf/libftprintf.a -o server_bonus
	@cd ft_printf && make all
	@gcc -Wall -Wextra -Werror "src bonus/client_bonus.c" ft_printf/libftprintf.a -o client_bonus

fclean:
	@cd ft_printf && make fclean
	@rm -f server
	@rm -f client
	@rm -f server_bonus
	@rm -f client_bonus

re: fclean all

.PHONY: all clean fclean re bonus