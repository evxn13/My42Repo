/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   exec_utils.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/19 20:38:21 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/19 20:38:21 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	ft_is_builtin(t_token *tokens)
{
	if (!ft_strncmp(tokens->value, "pwd", 4))
		return (1);
	else if (!ft_strncmp(tokens->value, "env", 4))
		return (1);
	else if (!ft_strncmp(tokens->value, "cd", 3))
		return (1);
	else if (!ft_strncmp(tokens->value, "export", 7) && (!tokens->next
			|| (tokens->next && tokens->next->type != WORD)))
		return (1);
	else if (!ft_strncmp(tokens->value, "export", 7))
		return (1);
	else if (!ft_strncmp(tokens->value, "unset", 6))
		return (1);
	else if (!ft_strncmp(tokens->value, "echo", 5))
		return (2);
	else if (!ft_strncmp(tokens->value, "exit", 5))
		return (1);
	return (0);
}

void	ft_builtin_export(t_token *tokens, t_env *env)
{
	char	*value;

	value = NULL;
	if (!tokens->next || (tokens->next && tokens->next->type != WORD))
		ft_print_export(env);
	else
	{
		if (tokens->next)
			value = tokens->next->value;
		ft_export(value, &env);
	}
}

void	ft_builtin(t_token *tokens, t_env *env)
{
	char	*value;

	value = NULL;
	if (!ft_strncmp(tokens->value, "pwd", 4))
		ft_pwd();
	else if (!ft_strncmp(tokens->value, "env", 4))
		ft_print_env(env);
	else if (!ft_strncmp(tokens->value, "cd", 3))
		ft_cd(tokens, env);
	else if (!ft_strncmp(tokens->value, "export", 7))
		ft_builtin_export(tokens, env);
	else if (!ft_strncmp(tokens->value, "unset", 6))
	{
		if (tokens->next)
			value = tokens->next->value;
		ft_unset(value, env);
	}
	else if (!ft_strncmp(tokens->value, "echo", 5))
		ft_echo(tokens, env);
	else if (!ft_strncmp(tokens->value, "exit", 5))
		ft_exit(tokens, env);
}

t_token	*ft_remove_tokens_2(t_token *tokens)
{
	t_token	*tmp;

	while ((tokens->type == REDIRECTOR_OUT
			|| tokens->type == REDIRECTOR_IN
			|| tokens->type == REDIRECTOR_DOUBLE_IN
			|| tokens->type == REDIRECTOR_DOUBLE_OUT)
		&& tokens->next
		&& tokens->next->type != PIPE)
	{
		tmp = tokens->next->next;
		free(tokens->next->value);
		free(tokens->next);
		free(tokens->value);
		free(tokens);
		tokens = tmp;
	}
	return (tokens);
}

t_token	*ft_remove_tokens(t_token *tokens)
{
	t_token	*first;
	t_token	*tmp;

	tokens = ft_remove_tokens_2(tokens);
	first = tokens;
	while (tokens->next && tokens->type != PIPE)
	{
		if ((tokens->next->type == REDIRECTOR_OUT
				|| tokens->next->type == REDIRECTOR_IN
				|| tokens->next->type == REDIRECTOR_DOUBLE_IN
				|| tokens->next->type == REDIRECTOR_DOUBLE_OUT)
			&& tokens->next->next
			&& tokens->next->next->type != PIPE)
		{
			tmp = tokens->next->next->next;
			free(tokens->next->next->value);
			free(tokens->next->next);
			free(tokens->next->value);
			free(tokens->next);
			tokens->next = tmp;
		}
		else
			tokens = tokens->next;
	}
	return (first);
}
