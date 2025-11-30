/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils1.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: rheyer <rheyer@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/05/09 17:50:06 by rheyer            #+#    #+#             */
/*   Updated: 2023/07/09 19:42:18 by rheyer           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	ft_putstr_fd(const char *s, int fd)
{
	int	i;

	i = 0;
	while (s[i])
	{
		write(fd, &s[i], 1);
		i++;
	}
}

size_t	ft_strlen(const char *str)
{
	int	a;

	a = 0;
	while (str[a])
		a++;
	return (a);
}

int	is_option_n(char *arg)
{
	if ((arg[0] == '-' ) && (arg[1] == '\0'))
		return (0);
	if (!arg || arg[0] != '-')
		return (0);
	arg++;
	while (*arg)
	{
		if (*arg != 'n')
			return (0);
		arg++;
	}
	return (1);
}

int	ft_count_quotes(char *str)
{
	int	i;
	int	n;

	i = 0;
	n = 0;
	while (str[i])
	{
		if (str[i] == '\"' || str[i] == '\'')
			n++;
		i++;
	}
	return (n);
}

char	*ft_remove_quotes(char *str)
{
	char	*res;
	int		i;
	int		j;

	res = malloc(sizeof(char) * (ft_strlen(str) + 1 - ft_count_quotes(str)));
	i = 0;
	j = 0;
	while (str[i])
	{
		while (str[i] == '\"' || str[i] == '\'')
			i++;
		res[j] = str[i];
		i++;
		j++;
	}
	res[j] = '\0';
	return (res);
}
