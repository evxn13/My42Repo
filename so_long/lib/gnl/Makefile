SRCS    =   get_next_line.c \
			get_next_line_utils.c

OBJS			= $(SRCS:.c=.o)


CC				= gcc
RM				= rm -f
CFLAGS			= -Wall -Wextra -Werror
NAME			= libftgnl.a

.SILENT: $(OBJ)

.c.o:
	@gcc ${CFLAGS} -I /usr/local/include/ -c $< -o $@


all:			$(NAME)

$(NAME):		$(OBJS)
				ar rcs $(NAME) $(OBJS)

clean:
				$(RM) $(OBJS) $(BONUS_OBJS)

fclean:			clean
				$(RM) $(NAME)

re:				fclean $(NAME)

bonus:			$(OBJS)
				ar rcs $(NAME) $(OBJS)

.PHONY:			all clean fclean re bonus
