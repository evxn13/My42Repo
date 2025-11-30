/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_cd.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: rheyer <rheyer@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/05/10 23:05:19 by evscheid          #+#    #+#             */
/*   Updated: 2023/07/06 22:25:45 by rheyer           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*ft_cd_dollar(t_token *args, t_env *env, char *path)
{
	char	*env_var;

	if (args->next && args->next->value)
		env_var = args->next->value + 1;
	if (args->next && args->next->value && args->next->value[0] == '$')
		path = get_env_value(env, env_var);
	return (path);
}

char	*ft_cd_home(t_env *env, char *path)
{
	path = get_env_value(env, "HOME");
	env->exit_code = 0;
	return (path);
}

int	ft_cd_error(char *old_pwd, t_env *env, char *path)
{
	if (old_pwd == NULL)
	{
		perror("getcwd error");
		env->exit_code = 1;
		return (1);
	}
	else if (chdir(path) != 0)
	{
		perror("cd error");
		env->exit_code = 1;
		return (1);
	}
	return (0);
}

void	ft_cd_bis(char *old_pwd, t_env *env, char *path)
{
	char	*new_pwd;

	if (ft_cd_error(old_pwd, env, path))
		return ;
	else
	{
		check_and_update_oldpwd(env, old_pwd);
		free(old_pwd);
		new_pwd = getcwd(NULL, 0);
		if (new_pwd == NULL)
		{
			perror("getcwd error");
			env->exit_code = 1;
		}
		else
		{
			check_and_update_pwd(env, new_pwd);
			free(new_pwd);
		}
	}
}

int	ft_cd(t_token *args, t_env *env)
{
	char	*path;
	char	*old_pwd;

	path = NULL;
	if (ft_cd_arg_count(args, has_operator(args), env))
		return (env->exit_code);
	path = ft_cd_dollar(args, env, path);
	path = ft_cd_oldpwd(args, env, path);
	if (args->next && args->next->value && args->next->value[0] == '~')
		path = ft_cd_home(env, path);
	else
	{
		if (args->next == NULL || args->next->value == NULL)
			path = get_env_value(env, "HOME");
		else if (args->next->value[0] != '-')
			path = args->next->value;
	}
	old_pwd = getcwd(NULL, 0);
	ft_cd_bis(old_pwd, env, path);
	return (env->exit_code);
}
