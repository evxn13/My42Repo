/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils5.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: rheyer <rheyer@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/07/06 21:41:18 by rheyer            #+#    #+#             */
/*   Updated: 2023/07/09 19:07:41 by rheyer           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*get_key(char *str)
{
	char	*equal_ptr;

	equal_ptr = ft_strchr(str, '=');
	if (!equal_ptr)
		return (NULL);
	return (ft_strndup(str, equal_ptr - str));
}

char	*get_value(char *str)
{
	char	*equal_ptr;

	equal_ptr = ft_strchr(str, '=');
	if (!equal_ptr)
		return (NULL);
	return (ft_strdup(equal_ptr + 1));
}

void	handle_shlvl(char **value)
{
	int	shlvl_value;

	if (ft_strcmp(*value, "SHLVL") == 0)
	{
		shlvl_value = ft_atoi(*value);
		shlvl_value++;
		free(*value);
		*value = ft_itoa(shlvl_value);
	}
}

void	add_env_node_envcpy(t_env **env, char *key, char *value)
{
	t_env	*current;

	if (!*env)
	{
		*env = new_env_node(key, value);
		current = *env;
	}
	else
	{
		current = *env;
		while (current->next)
			current = current->next;
		current->next = new_env_node(key, value);
	}
}

void	ft_envcpy(char **envi, t_env **env, int i)
{
	char	*key;
	char	*value;

	while (envi[i])
	{
		key = get_key(envi[i]);
		value = get_value(envi[i]);
		if (!key || !value)
		{
			i++;
			continue ;
		}
		handle_shlvl(&value);
		add_env_node_envcpy(env, key, value);
		free(key);
		free(value);
		i++;
	}
}
