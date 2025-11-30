CXX = c++
CXXFLAGS = -Wall -Wextra -Werror -std=c++98 -pedantic

NAME = Serializer
SRCS = src/main.cpp src/Serializer.cpp
OBJS = $(SRCS:.cpp=.o)

all: $(NAME)

$(NAME): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^

clean:
	@rm -f $(OBJS)
	@echo Cleaned up.

fclean: clean
	@rm -f $(NAME)
	@echo Fully cleaned up.

re: fclean all

.PHONY: all clean fclean re