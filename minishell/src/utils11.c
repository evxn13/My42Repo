/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils11.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/29 13:53:02 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/29 13:53:02 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	is_single_expander(t_token *tokens, t_env *env)
{
	char	*env_value;

	if (get_env_value(env, tokens->value + 1) != NULL)
		env_value = get_env_value(env, tokens->value + 1);
	else
		env_value = tokens->value + 1;
	if (ft_strncmp(tokens->value, "$?", 3) == 0)
	{
		ft_putnbr(env->exit_code);
		ft_putstr_fd(": ", 2);
		ft_putstr_fd("command not found\n", 2);
		env->exit_code = 127;
		exit(env->exit_code);
	}
	if (ft_strncmp(tokens->value, "$", 1) == 0 && ft_strlen(tokens->value) > 1)
	{
		ft_putstr_fd("-minishell ", 2);
		ft_putstr_fd(env_value, 2);
		ft_putstr_fd(": command not found\n", 2);
		env->exit_code = 127;
		exit(env->exit_code);
	}
}

void	is_var_exec(t_token *tokens, t_env *env, char **paths, char *env_value)
{
	if (tokens->value[0] == '$')
	{
		if ((!env_value || ft_strlen(env_value) == 0) && !tokens->next)
		{
			env->exit_code = 0;
			exit(env->exit_code);
		}
		else if (is_a_env_var(env, tokens->value + 1) == 0)
		{
			if (ft_is_builtin(tokens))
				ft_builtin(tokens->next, env);
			else
				exec_child_process(tokens->next, env, paths);
		}
	}
}

void	handle_absolute_path(t_token *tokens, t_env *env)
{
	DIR	*dir;

	if (access(tokens->value, X_OK) == 0)
	{
		dir = opendir(tokens->value);
		if (dir)
			handle_directory_error(tokens, env, dir);
		else
			execute_command(tokens, env, tokens->value);
	}
	else
		handle_file_errors(tokens, env);
}

void	handle_relative_path(t_token *tokens, t_env *env, char **paths)
{
	int		i;
	char	*cmd;

	i = 0;
	while (paths[i])
	{
		cmd = get_command_path(paths[i], tokens->value);
		if (access(cmd, X_OK) == 0)
		{
			execute_command(tokens, env, cmd);
			free(cmd);
			return ;
		}
		free(cmd);
		i++;
	}
	handle_file_errors(tokens, env);
}

int	exec_child_process(t_token *tokens, t_env *env, char **paths)
{
	char	*env_value;

	env_value = get_env_value(env, tokens->value + 1);
	is_single_expander(tokens, env);
	is_var_exec(tokens, env, paths, env_value);
	tokens->value = ft_remove_quotes(tokens->value);
	if (tokens->value[0] == '/' || ft_strncmp(tokens->value, "./", 2) == 0)
		handle_absolute_path(tokens, env);
	else
		handle_relative_path(tokens, env, paths);
	exit(env->exit_code);
}
