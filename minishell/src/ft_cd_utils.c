/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_cd_utils.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/29 14:19:24 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/29 14:19:24 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	old_pwd(t_env *env)
{
	char	*old_pwd;

	old_pwd = get_env_value(env, "OLDPWD");
	if (old_pwd != NULL)
	{
		if (chdir(old_pwd) == -1)
			perror("error: chdir");
		old_pwd = getcwd(NULL, 0);
		if (old_pwd == NULL)
			perror("error: getcwd");
		update_env_value(env, "OLDPWD", old_pwd);
		free(old_pwd);
	}
}

void	new_pwd(t_env *env)
{
	char	*env_pwd;
	char	*new_pwd;

	env_pwd = get_env_value(env, "PWD");
	if (env_pwd != NULL)
	{
		new_pwd = ft_pwd();
		update_env_value(env, "PWD", new_pwd);
		free(new_pwd);
	}
}

void	check_and_update_oldpwd(t_env *env, char *old_pwd)
{
	char	*env_old_pwd;
	char	*arg;

	env_old_pwd = get_env_value(env, "OLDPWD");
	if (env_old_pwd == NULL)
	{
		arg = ft_strjoin("OLDPWD", "=");
		env_old_pwd = ft_strjoin(arg, old_pwd);
		ft_export(env_old_pwd, &env);
		free(env_old_pwd);
		free(arg);
	}
	else
		update_env_value(env, "OLDPWD", old_pwd);
}

void	check_and_update_pwd(t_env *env, char *new_pwd)
{
	char	*env_pwd;
	char	*arg;

	env_pwd = get_env_value(env, "PWD");
	if (env_pwd == NULL)
	{
		arg = ft_strjoin("PWD", "=");
		env_pwd = ft_strjoin(arg, new_pwd);
		ft_export(env_pwd, &env);
		free(env_pwd);
		free(arg);
	}
	else
		update_env_value(env, "PWD", new_pwd);
}

int	has_operator(t_token *args)
{
	while (args)
	{
		if (args->type == PIPE
			|| args->type == REDIRECTOR_IN
			|| args->type == REDIRECTOR_OUT
			|| args->type == REDIRECTOR_DOUBLE_IN
			|| args->type == REDIRECTOR_DOUBLE_OUT)
			return (1);
		args = args->next;
	}
	return (0);
}
