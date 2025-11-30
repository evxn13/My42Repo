/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils1.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/07 17:17:13 by marvin            #+#    #+#             */
/*   Updated: 2023/11/07 17:17:13 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

int	ft_strslen(char **tab)
{
	int	i;

	i = 0;
	if (!tab)
		return (0);
	while (tab[i])
		i++;
	return (i);
}

void	*ft_calloc(size_t count, size_t size)
{
	void	*tab;
	size_t	i;
	char	*c;

	i = 0;
	if (count != 0)
		if (SIZE_MAX / count < size)
			return (NULL);
	tab = malloc(count * size);
	if (!tab)
		ft_error("Malloc error", NULL);
	c = (char *)tab;
	while (i < (count * size))
	{
		c[i] = 0;
		i++;
	}
	return (c);
}

char	*ft_charjoin(char *s1, char s2)
{
	char	*dest;
	int		i;

	i = 0;
	if (!s1 || s2 == '\r')
		return ((char *)s1);
	dest = ft_calloc((ft_strlen(s1) + 2), sizeof(char));
	if (!dest)
		return (NULL);
	while (s1[i])
	{
		dest[i] = s1[i];
		i++;
	}
	dest[i] = s2;
	i++;
	dest[i] = '\0';
	free(s1);
	return (dest);
}

void	ft_error(char *str, t_map *map)
{
	printf("Error\n%s\n", str);
	if (map)
		ft_free_strs(map->mat);
	exit(1);
}

int	ft_atoi(char *s)
{
	int	sign;
	int	all;
	int	i;

	i = 0;
	all = 0;
	sign = 1;
	while (s[i] == ' ' || s[i] == '\n' || s[i] == '\v'
		|| s[i] == '\t' || s[i] == '\r' || s[i] == '\f')
		i++;
	if (s[i] == '+' || s[i] == '-')
	{
		if (s[i] == '-')
			sign *= -1;
		i++;
	}
	while ((s[i] >= '0') && (s[i] <= '9'))
	{
		all = all * 10 + s[i] - '0';
		i++;
	}
	return (all * sign);
}
