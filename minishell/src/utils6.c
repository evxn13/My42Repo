/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils6.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: rheyer <rheyer@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/07/06 21:53:12 by rheyer            #+#    #+#             */
/*   Updated: 2023/07/08 20:32:25 by rheyer           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	ft_error(char *cmd, char *error)
{
	ft_putstr_fd("minishell: ", 2);
	ft_putstr_fd(cmd, 2);
	ft_putstr_fd(": ", 2);
	ft_putstr_fd(error, 2);
	write(2, "\n", 1);
}

int	ft_is_pipe(t_token *tokens)
{
	int	i;

	i = 0;
	if (tokens)
	{
		while (tokens->next)
		{
			if (tokens->type == PIPE)
				i++;
			tokens = tokens->next;
		}
	}
	return (i);
}

int	ft_is_input(t_token *tokens)
{
	if (tokens)
	{
		while (tokens->next && tokens->type != PIPE)
		{
			if (tokens->type == REDIRECTOR_IN
				|| tokens->type == REDIRECTOR_DOUBLE_IN)
				return (1);
			tokens = tokens->next;
		}
	}
	return (0);
}

int	ft_is_output(t_token *tokens)
{
	if (tokens)
	{
		while (tokens->next && tokens->type != PIPE)
		{
			if (tokens->type == REDIRECTOR_OUT
				|| tokens->type == REDIRECTOR_DOUBLE_OUT)
				return (1);
			tokens = tokens->next;
		}
	}
	return (0);
}

t_env	*new_env_node(char *key, char *value)
{
	t_env	*new;

	new = (t_env *)malloc(sizeof(t_env));
	if (!new)
		return (NULL);
	if (key == NULL)
		new->key = NULL;
	else
		new->key = ft_strdup(key);
	if (value == NULL)
		new->value = NULL;
	else
		new->value = ft_strdup(value);
	new->next = NULL;
	return (new);
}
