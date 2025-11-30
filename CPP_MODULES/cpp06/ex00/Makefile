CXX = c++
CXXFLAGS = -Wall -Wextra -Werror -std=c++98 -pedantic

NAME = ScalarConverter
SRCS = src/main.cpp src/ScalarConverter.cpp
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