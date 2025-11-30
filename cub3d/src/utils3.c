/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils3.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/13 21:46:02 by marvin            #+#    #+#             */
/*   Updated: 2023/11/13 21:46:02 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

char	*ft_free_to_trim(char *s1, char *set)
{
	char	*tmp;

	if (!s1)
		s1 = ft_calloc(1, sizeof(char));
	tmp = ft_strtrim(s1, set);
	free(s1);
	return (tmp);
}

int	ft_is_set(char c, const char *set)
{
	int	i;

	i = 0;
	while (set[i])
	{
		if (set[i] == c)
			return (1);
		i++;
	}
	return (0);
}

int	ft_strncmp(const char *s1, const char *s2, size_t n)
{
	size_t	i;
	int		res;

	i = 0;
	res = 0;
	while (i < n && !res && (s1[i] || s2[i]))
	{
		res = (unsigned char)s1[i] - (unsigned char)s2[i];
		i++;
	}
	return (res);
}

char	ft_find_map_dir(t_map *map)
{
	int	i;
	int	j;

	i = 0;
	while (i < map->hei)
	{
		j = 0;
		while (j < ft_strlen(map->mat[i]))
		{
			if (map->mat[i][j] == 'N' || map->mat[i][j] == 'S'
				|| map->mat[i][j] == 'E' || map->mat[i][j] == 'W')
				return (map->mat[i][j]);
			j++;
		}
		i++;
	}
	return (0);
}

bool	ft_is_valid_map_char(char c)
{
	if (c == '0' || c == '1' || c == 'N' || c == 'S'
		|| c == 'E' || c == 'W' || c == ' ')
		return (true);
	return (false);
}
