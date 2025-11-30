INC_DIR_M			= main/include/
SRC_DIR_M			= main/src/
OBJ_DIR_M			= main/obj/



INC_DIR_B			= bot/include/
LIB_DIR_B			= bot/lib/
SRC_DIR_B			= bot/src/
OBJ_DIR_B			= bot/obj/



CC				= c++

RM				= rm -f

NAME_MAIN		= ircserv

NAME_BOT		= botclient

CFLAGS			= -Wall -Wextra -Werror -std=c++98

LIBS_B			= -L$(LIB_DIR_B) -lssl -lcrypto



DEPS_M			= Makefile $(addprefix $(INC_DIR_M), \
					class/Channel.hpp \
					class/Client.hpp \
					class/Server.hpp \
					cmd/cmd_register.hpp \
					cmd/cmd_handler.hpp \
					cmd/cmd_unregister.hpp \
					ft_irc.hpp \
					utils.hpp)

SRCS_M			= $(addprefix $(SRC_DIR_M), \
					class/Channel.cpp \
					class/Client.cpp \
					class/Server.cpp \
					cmd/cmd_register/cmd_register_invite.cpp \
					cmd/cmd_register/cmd_register_join.cpp \
					cmd/cmd_register/cmd_register_kick.cpp \
					cmd/cmd_register/cmd_register_mode.cpp \
					cmd/cmd_register/cmd_register_motd.cpp \
					cmd/cmd_register/cmd_register_names.cpp \
					cmd/cmd_register/cmd_register_part.cpp \
					cmd/cmd_register/cmd_register_ping.cpp \
					cmd/cmd_register/cmd_register_privmsg.cpp \
					cmd/cmd_register/cmd_register_topic.cpp \
					cmd/cmd_register/cmd_register_who.cpp \
					cmd/cmd_unregister/cmd_unregister_cap.cpp \
					cmd/cmd_unregister/cmd_unregister_nick.cpp \
					cmd/cmd_unregister/cmd_unregister_pass.cpp \
					cmd/cmd_unregister/cmd_unregister_quit.cpp \
					cmd/cmd_unregister/cmd_unregister_user.cpp \
					cmd/cmd_handler.cpp \
					ft_irc.cpp \
					utils.cpp)

OBJS_M			= $(patsubst $(SRC_DIR_M)%.cpp,$(OBJ_DIR_M)%.o, $(SRCS_M))



DEPS_B			= Makefile $(addprefix $(INC_DIR_B), \
					Bot.hpp \
					main.hpp \
					utils.hpp)

SRCS_B			= $(addprefix $(SRC_DIR_B), \
					Bot.cpp \
					main.cpp \
					utils.cpp)

OBJS_B			= $(patsubst $(SRC_DIR_B)%.cpp,$(OBJ_DIR_B)%.o, $(SRCS_B))



ifndef BONUS
	OBJS    = $(OBJS_M)
	NAME	= $(NAME_MAIN)
else
	OBJS    = $(OBJS_B)
	NAME	= $(NAME_BOT)
endif



all:				$(NAME)

$(NAME):			$(OBJS)
ifndef BONUS
					$(CC) $(CFLAGS) $(OBJS) -o $(NAME)
else
					$(CC) $(CFLAGS) $(OBJS) -o $(NAME) $(LIBS_B)
endif



$(OBJ_DIR_M)%.o:	$(SRC_DIR_M)%.cpp $(DEPS_M) | $(OBJ_DIR_M)
					$(CC) $(CFLAGS) -I$(INC_DIR_M) -c $< -o $@

$(OBJ_DIR_M)class/%.o:	$(SRC_DIR_M)class/%.cpp $(DEPS_M) | $(OBJ_DIR_M)class
						$(CC) $(CFLAGS) -I$(INC_DIR_M) -c $< -o $@

$(OBJ_DIR_M)cmd/%.o:	$(SRC_DIR_M)cmd/%.cpp $(DEPS_M) | $(OBJ_DIR_M)cmd
						$(CC) $(CFLAGS) -I$(INC_DIR_M) -c $< -o $@

$(OBJ_DIR_M)cmd/cmd_register/%.o:	$(SRC_DIR_M)cmd/cmd_register/%.cpp $(DEPS_M) | $(OBJ_DIR_M)cmd/cmd_register
									$(CC) $(CFLAGS) -I$(INC_DIR_M) -c $< -o $@

$(OBJ_DIR_M)cmd/cmd_unregister/%.o:	$(SRC_DIR_M)cmd/cmd_unregister/%.cpp $(DEPS_M) | $(OBJ_DIR_M)cmd/cmd_unregister
									$(CC) $(CFLAGS) -I$(INC_DIR_M) -c $< -o $@

$(OBJ_DIR_M):
				mkdir -p $(OBJ_DIR_M)

$(OBJ_DIR_M)class:
					mkdir -p $(OBJ_DIR_M)class

$(OBJ_DIR_M)cmd:
					mkdir -p $(OBJ_DIR_M)cmd

$(OBJ_DIR_M)cmd/cmd_register:
								mkdir -p $(OBJ_DIR_M)cmd/cmd_register

$(OBJ_DIR_M)cmd/cmd_unregister:
								mkdir -p $(OBJ_DIR_M)cmd/cmd_unregister



$(OBJ_DIR_B)%.o:	$(SRC_DIR_B)%.cpp $(DEPS_B) | $(OBJ_DIR_B)
					$(CC) $(CFLAGS) -I$(INC_DIR_B) -c $< -o $@


$(OBJ_DIR_B):
				mkdir -p $(OBJ_DIR_B)



bonus:
				$(MAKE) BONUS=1 all

clean:
				$(RM) -r $(OBJ_DIR_M) $(OBJ_DIR_B)

fclean:			clean
				$(RM) $(NAME) $(NAME_BOT)

re:				fclean all

.PHONY:			all bonus clean fclean re
