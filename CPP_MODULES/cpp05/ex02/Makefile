CXX = c++
CXXFLAGS = -Wall -Wextra -Werror -std=c++98 -Iinclude -pedantic
NAME = bureaucrat

SRC = src/main.cpp src/Bureaucrat.cpp src/AForm.cpp \
      src/ShrubberyCreationForm.cpp src/RobotomyRequestForm.cpp \
      src/PresidentialPardonForm.cpp
OBJ = $(SRC:.cpp=.o)

all: $(NAME)

$(NAME): $(OBJ)
	$(CXX) $(CXXFLAGS) -o $(NAME) $(OBJ)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(OBJ)
	rm -f *_shrubbery

fclean: clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re
