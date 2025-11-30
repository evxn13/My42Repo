/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils7.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 22:00:23 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/18 22:00:23 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*get_env_value(t_env *env, const char *key)
{
	while (env != NULL)
	{
		if (ft_strcmp(env->key, key) == 0)
			return (env->value);
		env = env->next;
	}
	return (NULL);
}

t_env	*find_last_env_node(t_env *env)
{
	if (!env)
		return (0);
	while (env->next)
		env = env->next;
	return (env);
}

int	error_dollar(char *input, t_env *env)
{
	if (!ft_strcmp(input, "$"))
	{
		ft_putstr_fd(input, 2);
		ft_putstr_fd(": command not found\n", 2);
		env->exit_code = 127;
		return (1);
	}
	return (0);
}

int	count(long int i)
{
	int	c;

	c = 0;
	if (i < 0)
	{
		i *= -1;
		c++;
	}
	while (i > 0)
	{
		i /= 10;
		c++;
	}
	return (c);
}

char	*ft_itoa(int n)
{
	char		*s;
	int			i;

	i = count(n);
	if (n == -2147483648)
		return (ft_strdup("-2147483648"));
	if (n == 0)
		return (ft_strdup("0"));
	s = malloc(sizeof(char) * i + 1);
	if (!s)
		return (0);
	if (n < 0)
	{
		s[0] = '-';
		n *= -1;
	}
	s[i] = '\0';
	i--;
	while (n > 0)
	{
		s[i--] = (n % 10) + '0';
		n /= 10;
	}
	return (s);
}
