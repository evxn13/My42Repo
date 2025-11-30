/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_exit.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: rheyer <rheyer@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/05/12 18:31:23 by evscheid          #+#    #+#             */
/*   Updated: 2023/07/06 22:20:17 by rheyer           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*remove_quotes(char *str)
{
	int	len;

	len = ft_strlen(str);
	if ((str[0] == '\"' && str[len - 1] == '\"')
		|| (str[0] == '\'' && str[len - 1] == '\''))
	{
		str[len - 1] = '\0';
		return (str + 1);
	}
	return (str);
}

void	ft_exit_overflow(t_token *tokens, char *endptr, long int tmp)
{
	if (*endptr != '\0')
	{
		print_exit_overflow(tokens);
		exit(2);
	}
	if (tmp > 2147483647 || tmp < -2147483648)
	{
		print_exit_overflow(tokens);
		exit(2);
	}
}

int	exit_to_many_args(t_token *tokens)
{
	if (tokens->next->next)
	{
		print_error_too_many_args();
		return (1);
	}
	return (0);
}

void	init_tmp_exit(long int tmp, t_env *env, int is_negative)
{
	if (is_negative)
		tmp = -tmp;
	env->exit_code = tmp % 256;
	if (tmp < 0)
		env->exit_code = 256 + tmp;
}

void	ft_exit(t_token *tokens, t_env *env)
{
	long int	tmp;
	char		*endptr;
	char		*value;

	env->exit_code = 0;
	if (tokens->next)
	{
		value = tokens->next->value;
		if (value[0] == '+' || value[0] == '-')
			value++;
		if (value[0] == '"' || value[0] == '\'')
		{
			value++;
			value[ft_strlen(value) - 1] = '\0';
		}
		if (exit_to_many_args(tokens))
			return ;
		tmp = ft_strtol(value, &endptr, 10);
		ft_exit_overflow(tokens, endptr, tmp);
		init_tmp_exit(tmp, env, (value[0] == '-'));
	}
	exit(env->exit_code);
}
