/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_export.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/05/10 02:21:02 by evscheid          #+#    #+#             */
/*   Updated: 2023/05/10 02:21:02 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	ft_export_1(t_env **env)
{
	t_env	*tmp;

	tmp = *env;
	while (tmp)
	{
		if (tmp->value)
			printf("declare -x %s=\"%s\"\n", tmp->key, tmp->value);
		else
			printf("declare -x %s=\"\"\n", tmp->key);
		tmp = tmp->next;
	}
	return (0);
}

int	handle_existing_node(t_env *existing_node, char *value)
{
	if (value)
	{
		free(existing_node->value);
		existing_node->value = ft_strdup(value);
	}
	return (0);
}

int	handle_new_node(t_env **env, char *key, char *value)
{
	t_env	*new_node;
	t_env	*last_node;

	new_node = new_env_node(key, value);
	if (!new_node)
		return (-1);
	last_node = find_last_env_node(*env);
	if (last_node)
		last_node->next = new_node;
	else
		*env = new_node;
	return (0);
}

void	assign_key_value(char *arg, char **key, char **value)
{
	char	*equals_sign;

	equals_sign = ft_strchr(arg, '=');
	*key = arg;
	if (equals_sign)
	{
		*equals_sign = '\0';
		*value = equals_sign + 1;
	}
	else
	{
		*value = NULL;
	}
}

int	ft_export(char *arg, t_env **env)
{
	char	*key;
	char	*value;
	t_env	*existing_node;

	if (!arg)
		return (ft_export_1(env));
	if (arg[0] == '=')
	{
		print_export_error(arg);
		return (1);
	}
	assign_key_value(arg, &key, &value);
	existing_node = get_env_value_export(*env, key);
	if (existing_node)
		return (handle_existing_node(existing_node, value));
	return (handle_new_node(env, key, value));
}
