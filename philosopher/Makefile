NAME = philo

SRCS = main.c utils.c parse.c init.c mutexes.c eat.c sleep.c think.c routine.c utils2.c
OBJS = $(SRCS:.c=.o)

CC = gcc
CFLAGS = -Wall -Wextra -Werror -pthread
TOTAL_FILES := $(words $(SRCS))
CURR_FILE = 1

define print_progress
	@progress=$$((($(CURR_FILE) * 100) / $(TOTAL_FILES))); \
	printf "(Compiling: ["; \
	completed=$$((progress / 5)); \
	printf "\033[32m"; \
	for i in $$(seq 1 $$completed); do \
		printf "█"; \
	done; \
	printf "\033[0m"; \
	for i in $$(seq $$((completed + 1)) 20); do \
		printf " "; \
	done; \
	printf "] %3d%% ($(CURR_FILE)/$(TOTAL_FILES))" $$progress
	@echo "\033[A"
endef

.c.o:
	@$(call print_progress)
	@$(CC) $(CFLAGS) -c $< -o ${<:.c=.o}
	@$(eval CURR_FILE = $(shell echo $$(($(CURR_FILE) + 1))))

all: $(NAME)

$(NAME): $(OBJS)
	@echo "(Compiling: [\033[32m███████████████████\033[0m] 100% ($(TOTAL_FILES)/$(TOTAL_FILES))"
	@$(CC) $(CFLAGS) -o $(NAME) $(OBJS)

clean:
	@rm -f $(OBJS)

fclean: clean
	@rm -f $(NAME)

re: fclean all