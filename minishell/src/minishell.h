/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   minishell.h                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: rheyer <rheyer@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/05/04 14:26:59 by rheyer            #+#    #+#             */
/*   Updated: 2023/07/09 20:30:35 by rheyer           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef MINISHELL_H
# define MINISHELL_H

# include <stdio.h>
# include <unistd.h>
# include <string.h>
# include <stdlib.h>
# include <signal.h>
# include <readline/readline.h>
# include <readline/history.h>
# include <dirent.h>
# include <errno.h>
# include <sys/types.h>
# include <sys/wait.h>
# include <fcntl.h>
# include <stdbool.h>
# include <limits.h>
# include <sys/stat.h>

typedef struct s_env
{
	char			*key;
	char			*value;
	int				exit_code;
	struct s_env	*next;
}				t_env;

typedef struct s_list
{
	void			*content;
	struct s_list	*next;
}	t_list;

typedef struct s_command
{
	char				**args;
	char				*stdin_file;
	char				*stdout_file;
	char				*stderr_file;
	struct s_command	*next;
}	t_command;

typedef enum e_token_type
{
	WORD,
	PIPE,
	REDIRECTOR_IN,
	REDIRECTOR_DOUBLE_IN,
	REDIRECTOR_OUT,
	REDIRECTOR_DOUBLE_OUT,
}	t_token_type;

typedef struct s_token
{
	t_token_type	type;
	char			*value;
	struct s_token	*next;
}	t_token;

typedef struct s_lexer_state
{
	int		i;
	int		start;
	bool	in_single_quote;
	bool	in_double_quote;
	t_token	**tokens;
}	t_lexer_state;

typedef struct s_pipex_args
{
	t_token	*tokens;
	t_env	*env;
	int		n;
	int		input;
	int		pipefd[2];
	pid_t	pid;
}	t_pipex_args;

/*   readline   */
int				rl_on_new_line(void);
void			rl_replace_line(const char *text, int clear_undo);
void			rl_redisplay(void);

/*   basic_env   */
void			ft_env_add(t_env **env, char *key, char *value);

/*   exec_utils1   */
int				ft_is_builtin(t_token *tokens);
void			ft_builtin_export(t_token *tokens, t_env *env);
void			ft_builtin(t_token *tokens, t_env *env);
t_token			*ft_remove_tokens_2(t_token *tokens);
t_token			*ft_remove_tokens(t_token *tokens);

/*   exec   */
void			child_2(char *cmd, t_token *tokens, t_env *env, char *path_env);
void			child(t_token *tokens, t_env *env, int output, int input);
void			ft_pipex_2(t_pipex_args *args);
void			ft_pipex(t_token *tokens, t_env *env, int n, int input);

/*   execve   */
char			**ft_env_lst_to_char_arr(t_env *env);
void			free_char_arr(char **arr);
char			*get_command_path(char *path, char *token);
char			**token_list_to_char_arr(t_token *tokens);
int				is_a_env_var(t_env *env, char *value);

/*   ft_cd   */
char			*ft_cd_dollar(t_token *args, t_env *env, char *path);
char			*ft_cd_home(t_env *env, char *path);
int				ft_cd_error(char *old_pwd, t_env *env, char *path);
void			ft_cd_bis(char *old_pwd, t_env *env, char *path);
int				ft_cd(t_token *args, t_env *env);

/*   ft_cd_utils   */
void			old_pwd(t_env *env);
void			new_pwd(t_env *env);
void			check_and_update_oldpwd(t_env *env, char *old_pwd);
void			check_and_update_pwd(t_env *env, char *new_pwd);
int				has_operator(t_token *args);

/*   ft_echo   */
char			*get_var_name(char **arg);
void			handle_dollar(char **arg, t_env *env);
void			read_file_content(const char *file_path);
int				ft_echo_arg(char *arg, t_env *env);
void			ft_echo(t_token *args, t_env *env);

/*   ft_exit   */
char			*remove_quotes(char *str);
void			ft_exit_overflow(t_token *tokens, char *endptr, long int tmp);
int				exit_to_many_args(t_token *tokens);
void			init_tmp_exit(long int tmp, t_env *env, int is_negative);
void			ft_exit(t_token *tokens, t_env *env);

/*   ft_export_utils   */
void			add_env_node(t_env *env, char *key, char *value);
void			update_env_value(t_env *env, char *key, char *value);
int				is_valid_identifier(char *str);
t_env			*get_env_value_export(t_env *env, char *key);

/*   ft_export   */
int				ft_export_1(t_env **env);
int				handle_existing_node(t_env *existing_node, char *value);
int				handle_new_node(t_env **env, char *key, char *value);
void			assign_key_value(char *arg, char **key, char **value);
int				ft_export(char *arg, t_env **env);

/*   ft_pwd   */
char			*ft_pwd(void);

/*   ft_unset   */
void			delete_env_node(t_env **env, t_env *prev, t_env *current);
void			ft_unset(char *arg, t_env *env);

/*   lexer   */
void			add_token(t_token **tokens, char *value, t_token_type type);
void			add_separator_token(t_token **tokens, char *input, int *i);
void			lexer_part2(char *in, t_lexer_state *state);
t_lexer_state	lexer_state_init(void);
t_token			*lexer(char *input);

/*   main   */
void			ft_set_minimal_env(t_env **env);
void			token_list_clear(t_token **tokens);
void			display_header(void);
int				main(int argc, char **argv, char **envi);

/*   minishell_utils   */
void			handle_input(t_token **tokens, t_env **env, char *input);
void			execute_commands(
					t_token *tok, t_env *env, int fd_in, int fd_out);
char			*parser(char *str);
char			*cat_all(char *prompt, char *user, char *name, char *pwd);
char			*create_prompt(t_env *env);

/*   minishell   */
int				error_expander(char *input, t_env *env);
int				input_check_is_heredoc(char *input);
char			*ft_minishell_1(t_env *env, char *input);
char			*ft_minishell_parse(t_env *env, char *input);
void			ft_minishell(t_token *tokens, t_env *env);

/*   parser_utils   */
int				check_unmatched_quotes(char *input);
int				input_end_is_space(char *input);
void			print_syntax_error(char *token);
int				handle_redirection_errors(char *input, int i);

/*		parser1		*/
void			update_state(char c, int *state);
int				handle_pipe(char *input, int i, int state);
int				check_invalid_operators(char *input);
char			*get_additional_input(void);

/*   parser2   */
char			*concat_input(char *input, char *additional_input);
void			count_quotes(char *s, int *s_cnt, int *d_cnt);
char			*parse_input(char *input);

/*   redirect1_utils   */
int				ft_redirect_out_1(t_token *tokens, int fd_out);
int				ft_redirect_in_1(t_token *tokens, int fd_in);
int				ft_redirect_double_out_1(t_token *tokens, int fd_out);
int				ft_redirect_double_in_1(t_token *tokens, int fd_in);

/*   redirect1   */
void			handle_dup2_exit(int input, int output, t_token *tokens);
void			handle_redirections_exit(
					t_token *tokens, int *fd_in, int *fd_out);
void			ft_redirect_1(t_token *tokens, int output, int input);
void			ft_redirect_bis_1(int input, int output, int fd_in, int fd_out);

/*   redirect2_utils   */
int				ft_redirect_out_2(t_token *tokens, int fd_out);
int				ft_redirect_in_2(t_token *tokens, int fd_in);
int				ft_redirect_double_out_2(t_token *tokens, int fd_out);
int				ft_redirect_double_in_2(t_token *tokens, int fd_in);

/*   redirect2   */
void			handle_dup2(int input, int output, t_token *tokens);
void			handle_redirections(t_token *tokens, int *fd_in, int *fd_out);
void			ft_redirect_2(t_token *tokens, int output, int input);
void			ft_redirect_bis_2(int input, int output, int fd_in, int fd_out);

/*   utils1   */
void			ft_putstr_fd(const char *s, int fd);
size_t			ft_strlen(const char *str);
int				is_option_n(char *arg);
int				ft_count_quotes(char *str);
char			*ft_remove_quotes(char *str);

/*   utils2   */
char			*ft_strdup(const char *src);
size_t			ft_split_len(const char *s, char c);
size_t			ft_number_word(const char *str, char c);
char			**ft_split(const char *str, char c);
int				extract_exit_code(int status);

/*   utils3   */
char			*ft_strjoin(const char *s1, const char *s2);
int				ft_strncmp(const char *s1, const char *s2, size_t n);
int				ft_strcmp(const char *s1, const char *s2);
void			ft_putnbr(int n);
void			ft_putstr(char *str);

/*   utils4   */
int				ft_env_len(t_env *lst);
int				ft_token_len(t_token *tokens);
void			ft_clear_env(t_env **env);
bool			ft_isspace(int c);
bool			ft_is_separator(char c);

/*   utils5   */
char			*get_key(char *str);
char			*get_value(char *str);
void			handle_shlvl(char **value);
void			add_env_node_envcpy(t_env **env, char *key, char *value);
void			ft_envcpy(char **envi, t_env **env, int i);

/*   utils6   */
void			ft_error(char *cmd, char *error);
int				ft_is_pipe(t_token *tokens);
int				ft_is_input(t_token *tokens);
int				ft_is_output(t_token *tokens);
t_env			*new_env_node(char *key, char *value);

/*   utils7   */
char			*get_env_value(t_env *env, const char *key);
t_env			*find_last_env_node(t_env *env);
int				error_dollar(char *input, t_env *env);
int				count(long int i);
char			*ft_itoa(int n);

/*   utils8   */
int				ft_strtol(const char *str, char **endptr, int base);
void			reseption(int signal);
void			handle_signal(void);
char			*ft_strncpy(char *dest, char *src, unsigned int n);
int				handle_quotes(char *arg, int quote_type);

/*   utils9   */
void			ft_print_env(t_env *env_list);
void			copy_keys_to_array(t_env *env, char **key_array);
void			sort_key_array(char **key_array, int len);
int				ft_print_export_2(t_env *temp_env, char **key_array, int i);
void			ft_print_export(t_env *env);

/*   utils10   */
int				is_echo_point_slash(char *arg);
int				is_dollar_and_quote(char *arg, t_env *env, int quote_type);
int				is_interagation(char *arg, t_env *env);
void			initialize_pipe(int pipefd[2]);
pid_t			create_fork(void);

/*   utils11   */
void			is_single_expander(t_token *tokens, t_env *env);
void			is_var_exec(
					t_token *tokens, t_env *env, char **paths, char *env_value);
void			handle_absolute_path(t_token *tokens, t_env *env);
void			handle_relative_path(t_token *tokens, t_env *env, char **paths);
int				exec_child_process(t_token *tokens, t_env *env, char **paths);

/*   utils12   */
void			handle_directory_error(t_token *tokens, t_env *env, DIR *dir);
void			execute_command(t_token *tokens, t_env *env, char *cmd);
void			handle_file_errors(t_token *tokens, t_env *env);
int				ft_cd_arg_count(t_token *args, int has_op, t_env *env);
char			*ft_cd_oldpwd(t_token *args, t_env *env, char *path);

/*   utils13   */
int				skip_whitespace(char *str, int i);

/*   utils14   */
char			*ft_strcat(char *dest, const char *src);
char			*ft_strcpy(char *dest, const char *src);
int				ft_atoi(const char *str);
void			ft_putchar(char c);

/*   utils15   */
char			*ft_strndup(const char *s, size_t n);
char			*ft_strchr(const char *s, int c);

/*   print_error   */
void			print_exit_overflow(t_token *tokens);
void			print_error_too_many_args(void);
void			print_no_such_file_or_directory(t_token *tokens);
void			print_command_not_found(t_token *tokens);
void			print_export_error(char *arg);

#endif