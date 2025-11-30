/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   execve.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: rheyer <rheyer@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/05/05 18:08:01 by evscheid          #+#    #+#             */
/*   Updated: 2023/07/09 20:08:54 by rheyer           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	**ft_env_lst_to_char_arr(t_env *env)
{
	char	**envp;
	int		env_len;
	int		i;
	char	*key_value;

	env_len = ft_env_len((t_env *)env);
	envp = (char **)malloc(sizeof(char *) * (env_len + 1));
	if (!envp)
		exit(EXIT_FAILURE);
	i = 0;
	while (env)
	{
		key_value = ft_strjoin(env->key, "=");
		envp[i] = ft_strjoin(key_value, env->value);
		free(key_value);
		if (!envp[i])
			exit(EXIT_FAILURE);
		env = env->next;
		i++;
	}
	envp[env_len] = NULL;
	return (envp);
}

void	free_char_arr(char **arr)
{
	int	i;

	if (!arr)
		return ;
	i = 0;
	while (arr[i])
	{
		free(arr[i]);
		i++;
	}
	free(arr);
}

char	*get_command_path(char *path, char *token)
{
	char	*tmp;
	char	*cmd;

	tmp = ft_strjoin(path, "/");
	cmd = ft_strjoin(tmp, token);
	free(tmp);
	return (cmd);
}

char	**token_list_to_char_arr(t_token *tokens)
{
	char	**args;
	int		token_len;
	int		i;

	token_len = ft_token_len(tokens);
	args = (char **)malloc(sizeof(char *) * (token_len + 1));
	if (!args)
		return (NULL);
	i = 0;
	while (tokens && tokens->type != PIPE)
	{
		args[i] = ft_remove_quotes(ft_strdup(tokens->value));
		tokens = tokens->next;
		i++;
	}
	args[i] = NULL;
	return (args);
}

int	is_a_env_var(t_env *env, char *value)
{
	if (env)
	{
		while (env)
		{
			if (ft_strcmp(env->key, value) == 0)
				return (1);
			env = env->next;
		}
	}
	return (0);
}
