/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils10.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/19 20:48:04 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/19 20:48:04 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	is_echo_point_slash(char *arg)
{
	if (ft_strncmp(arg, "./", 2) == 0)
	{
		read_file_content(arg);
		return (1);
	}
	return (0);
}

int	is_dollar_and_quote(char *arg, t_env *env, int quote_type)
{
	if (*arg == '$' && quote_type != 1)
	{
		handle_dollar(&arg, env);
		if (*(arg + 1) == '\0')
		{
			printf("\n");
			return (1);
		}
	}
	return (0);
}

int	is_interagation(char *arg, t_env *env)
{
	if (*arg == '?')
	{
		ft_putnbr(env->exit_code);
		return (1);
	}
	return (0);
}

void	initialize_pipe(int pipefd[2])
{
	if (pipe(pipefd) == -1)
	{
		perror("pipe failed");
		exit(0);
	}
}

pid_t	create_fork(void)
{
	pid_t	pid;

	pid = fork();
	if (pid == -1)
	{
		perror("fork failed");
		exit(0);
	}
	return (pid);
}
