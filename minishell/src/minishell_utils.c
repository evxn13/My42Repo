/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   minishell_utils_1.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 22:40:40 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/18 22:40:40 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../src/minishell.h"

void	handle_input(t_token **tokens, t_env **env, char *input)
{
	*tokens = lexer(input);
	if (*tokens && ft_strcmp((*tokens)->value, "-i") == 0)
	{
		ft_clear_env(env);
		ft_set_minimal_env(env);
	}
}

void	execute_commands(t_token *tok, t_env *env, int fd_in, int fd_out)
{
	if (tok)
	{
		if (ft_is_pipe(tok) == 0 && ft_is_builtin(tok))
		{
			ft_redirect_2(tok, dup(STDOUT_FILENO), dup(STDIN_FILENO));
			tok = ft_remove_tokens(tok);
			ft_builtin(tok, env);
			unlink("touche_pas_mon_heredoc_sinon_je_fais_une_depression");
			return ;
		}
		else
			ft_pipex(tok, env, ft_is_pipe(tok), dup(STDIN_FILENO));
	}
	token_list_clear(&tok);
	dup2(fd_in, STDIN_FILENO);
	dup2(fd_out, STDOUT_FILENO);
}

char	*parser(char *str)
{
	int	read_index;
	int	write_index;

	read_index = 0;
	write_index = 0;
	while (str[read_index])
	{
		if (str[read_index] != '\"')
		{
			str[write_index] = str[read_index];
			write_index++;
		}
		read_index++;
	}
	str[write_index] = '\0';
	return (str);
}

char	*cat_all(char *prompt, char *user, char *name, char *pwd)
{
	ft_strcpy(prompt, "\033[1;34m");
	ft_strcat(prompt, user);
	ft_strcat(prompt, "@\033[0m\033[1;34m");
	ft_strcat(prompt, name);
	ft_strcat(prompt, "\033[0m:\033[1;32m");
	ft_strcat(prompt, pwd);
	ft_strcat(prompt, "\033[0m\033[1;0m$ \033[0m");
	return (prompt);
}

char	*create_prompt(t_env *env)
{
	char	*prompt;
	char	*user;
	char	*name;
	char	*pwd;
	int		prompt_length;

	if (get_env_value(env, "USER") == NULL || get_env_value(env, "NAME") == NULL
		|| get_env_value(env, "PWD") == NULL)
		return (ft_strdup("\033[1;34mminishell>\033[0m\033[1;0m$ \033[0m"));
	user = get_env_value(env, "USER");
	pwd = get_env_value(env, "PWD");
	name = get_env_value(env, "NAME");
	ft_remove_quotes(user);
	ft_remove_quotes(pwd);
	ft_remove_quotes(name);
	prompt_length = ft_strlen(user) + ft_strlen(name) + ft_strlen(pwd) + 58;
	prompt = (char *)malloc(prompt_length);
	if (!prompt)
	{
		perror("malloc error");
		exit(EXIT_FAILURE);
	}
	prompt = cat_all(prompt, user, name, pwd);
	return (prompt);
}
