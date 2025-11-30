/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   minishell.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: rheyer <rheyer@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/05/04 14:17:15 by rheyer            #+#    #+#             */
/*   Updated: 2023/07/09 19:26:00 by rheyer           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	ft_set_minimal_env(t_env **env)
{
	char	*pwd;
	char	*oldpwd;

	pwd = getcwd(NULL, 0);
	oldpwd = getcwd(NULL, 0);
	if (!pwd || !oldpwd)
		return ;
	ft_env_add(env, "PWD", pwd);
	ft_env_add(env, "OLDPWD", oldpwd);
	ft_env_add(env, "SHLVL", "1");
	free(pwd);
	free(oldpwd);
}

void	token_list_clear(t_token **tokens)
{
	t_token	*tmp;

	while (*tokens)
	{
		tmp = (*tokens)->next;
		free((*tokens)->value);
		free(*tokens);
		*tokens = tmp;
	}
}

void	display_header(void)
{
	int		fd;
	char	buffer[1024];
	ssize_t	bytes_read;

	fd = open("src/header.txt", O_RDONLY);
	if (fd == -1)
		return ;
	write(1, "\033[1;33m", 7);
	bytes_read = read(fd, buffer, sizeof(buffer) - 1);
	while (bytes_read > 0)
	{
		buffer[bytes_read] = '\0';
		write(1, buffer, bytes_read);
		write(1, "\n", 1);
		bytes_read = read(fd, buffer, sizeof(buffer) - 1);
	}
	write(1, "\033[0m", 4);
	close(fd);
}

int	main(int argc, char **argv, char **envi)
{
	t_token	*tokens;
	t_env	*env;

	tokens = NULL;
	env = NULL;
	(void)argc;
	(void)argv;
	handle_signal();
	if (envi[0] == NULL)
		ft_set_minimal_env(&env);
	else if (envi)
		ft_envcpy(envi, &env, 0);
	display_header();
	ft_minishell(tokens, env);
	return (env->exit_code);
}
