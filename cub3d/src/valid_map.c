/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   valid_map.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/13 21:55:29 by marvin            #+#    #+#             */
/*   Updated: 2023/11/13 21:55:29 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

bool	ft_is_line_valid(char *line)
{
	int	i;

	i = -1;
	while (line[++i])
	{
		if (line[i] != ' ' && line[i] != '\t' && line[i] != '\n'
			&& line[i] != '\r')
			break ;
		i++;
	}
	if (i >= ft_strlen(line))
		return (false);
	i = -1;
	while (line[++i])
	{
		if (!ft_is_valid_map_char(line[i]))
			return (false);
	}
	return (true);
}

void	ft_valid_matrix(t_map map)
{
	int	i;
	int	start;
	int	j;

	i = -1;
	start = 0;
	while (++i < map.hei)
	{
		j = -1;
		while (++j < ft_strlen(map.mat[i]))
		{
			if (map.mat[i][j] == 'N' || map.mat[i][j] == 'S'
				|| map.mat[i][j] == 'E' || map.mat[i][j] == 'W')
				start++;
			if (start > 1)
				ft_error("More than one spawn", &map);
			if (!ft_is_valid_map_char(map.mat[i][j]))
				ft_error("Invalid map char", &map);
		}
	}
}

void	ft_valid_map(t_map map)
{
	ft_valid_matrix(map);
	ft_chek_map_1(&map);
}

void	ft_chek_map_1(t_map *map)
{
	int	i;
	int	j;

	i = 0;
	while (map->mat[i])
	{
		j = 0;
		while (map->mat[i][j])
		{
			if (i == 0 && map->mat[i][j] == '0')
				ft_error("void in map", map);
			if (j == 0 && map->mat[i][j] == '0')
				ft_error("void in map", map);
			if (i == ft_strslen(map->mat) - 1 && map->mat[i][j] == '0')
				ft_error("void in map", map);
			if (j == ft_strlen(map->mat[i]) - 1 && map->mat[i][j] == '0')
				ft_error("void in map", map);
			if (map->mat[i][j] == ' ')
				ft_chek_map_2(map, i, j);
			j++;
		}
		i++;
	}
}

void	ft_chek_map_2(t_map *map, int i, int j)
{
	if (i - 1 > 0 && j - 1 > 0 && map->mat[i - 1][j - 1] == '0')
		ft_error("void in map", map);
	else if (i - 1 > 0 && map->mat[i - 1][j] == '0')
		ft_error("void in map", map);
	else if (i - 1 > 0 && j + 1 < ft_strlen(map->mat[i - 1])
		&& map->mat[i - 1][j + 1] == '0')
		ft_error("void in map", map);
	else if (j - 1 > 0 && map->mat[i][j - 1] == '0')
		ft_error("void in map", map);
	else if (j + 1 < ft_strlen(map->mat[i]) && map->mat[i][j + 1] == '0')
		ft_error("void in map", map);
	else if (i + 1 < ft_strslen(map->mat) && j - 1 > 0
		&& map->mat[i + 1][j - 1] == '0')
		ft_error("void in map", map);
	else if (i + 1 < ft_strslen(map->mat) && map->mat[i + 1][j] == '0')
		ft_error("void in map", map);
	else if (i + 1 < ft_strslen(map->mat)
		&& j + 1 < ft_strlen(map->mat[i + 1])
		&& map->mat[i + 1][j + 1] == '0')
		ft_error("void in map", map);
	else
		map->mat[i][j] = '1';
}
