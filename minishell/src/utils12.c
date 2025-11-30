/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils12.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/29 14:02:08 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/29 14:02:08 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	handle_directory_error(t_token *tokens, t_env *env, DIR *dir)
{
	ft_putstr_fd(tokens->value, 2);
	ft_putstr_fd(": Is a directory\n", 2);
	closedir(dir);
	env->exit_code = 126;
	exit(env->exit_code);
}

void	execute_command(t_token *tokens, t_env *env, char *cmd)
{
	execve(cmd, token_list_to_char_arr(tokens), ft_env_lst_to_char_arr(env));
	perror("execve");
	env->exit_code = 1;
	exit(env->exit_code);
}

void	handle_file_errors(t_token *tokens, t_env *env)
{
	if ((access(tokens->value, F_OK) == -1)
		&& (tokens->value[0] == '/' || ft_strncmp(tokens->value, "./", 2) == 0
			|| ft_strncmp(tokens->value, "$PWD", 4) == 0))
	{
		print_no_such_file_or_directory(tokens);
		env->exit_code = 127;
	}
	else if (access(tokens->value, F_OK) == -1)
	{
		print_command_not_found(tokens);
		env->exit_code = 127;
	}
	else if (access(tokens->value, X_OK) == -1)
	{
		perror(tokens->value);
		env->exit_code = 126;
	}
	else
	{
		print_command_not_found(tokens);
		env->exit_code = 127;
	}
}

int	ft_cd_arg_count(t_token *args, int has_op, t_env *env)
{
	t_token	*temp;
	int		arg_count;

	temp = args->next;
	arg_count = 0;
	while (temp)
	{
		arg_count++;
		temp = temp->next;
	}
	if (arg_count > 1 && !has_op)
	{
		ft_putstr_fd("cd: too many arguments\n", 2);
		env->exit_code = 1;
		return (1);
	}
	return (0);
}

char	*ft_cd_oldpwd(t_token *args, t_env *env, char *path)
{
	if (args->next && args->next->value && args->next->value[0] == '-')
	{
		path = get_env_value(env, "OLDPWD");
		env->exit_code = 0;
	}
	return (path);
}
