/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_unset.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/09/23 14:43:49 by evscheid          #+#    #+#             */
/*   Updated: 2023/09/23 14:43:49 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	delete_env_node(t_env **env, t_env *prev, t_env *current)
{
	if (prev == NULL)
		*env = current->next;
	else
		prev->next = current->next;
	free(current->key);
	free(current->value);
	free(current);
}

void	ft_unset(char *arg, t_env *env)
{
	t_env	*current;
	t_env	*prev;

	if (!arg || !env)
		return ;
	current = env;
	prev = NULL;
	while (current)
	{
		if (ft_strcmp(current->key, arg) == 0)
		{
			if (prev)
				delete_env_node(&prev->next, prev, current);
			else
				delete_env_node(&env, prev, current);
			break ;
		}
		prev = current;
		current = current->next;
	}
	env->exit_code = 0;
}
