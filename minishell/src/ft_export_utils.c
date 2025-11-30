/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_export_utils.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 23:31:56 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/18 23:31:56 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	add_env_node(t_env *env, char *key, char *value)
{
	t_env	*last_node;

	last_node = find_last_env_node(env);
	if (last_node)
		last_node->next = new_env_node(key, value);
}

void	update_env_value(t_env *env, char *key, char *value)
{
	while (env)
	{
		if (ft_strcmp(env->key, key) == 0)
		{
			free(env->value);
			env->value = ft_strdup(value);
			return ;
		}
		env = env->next;
	}
}

int	is_valid_identifier(char *str)
{
	if (!str || !*str || (!isalpha(*str) && *str != '_'))
		return (0);
	while (*++str)
	{
		if (!isalnum(*str) && *str != '_')
			return (0);
	}
	return (1);
}

t_env	*get_env_value_export(t_env *env, char *key)
{
	while (env)
	{
		if (ft_strcmp(env->key, key) == 0)
			return (env);
		env = env->next;
	}
	return (NULL);
}
