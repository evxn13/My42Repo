/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   map_init.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/13 21:50:41 by marvin            #+#    #+#             */
/*   Updated: 2023/11/13 21:50:41 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

t_map	ft_map_init_cub(void)
{
	t_map	map;

	map.mat = ft_calloc(1, sizeof(char *));
	map.hei = 0;
	map.wid = 0;
	if (!map.mat)
		ft_error("Malloc error", NULL);
	return (map);
}

t_map	ft_map_parser(char *path)
{
	int		fd;
	t_map	map;

	fd = open(path, O_RDONLY);
	if (fd < 0)
		ft_error("Map file not found", NULL);
	map = ft_map_init_cub();
	ft_fill_map(&map, fd);
	close(fd);
	ft_valid_map(map);
	ft_find_player(&map);
	return (map);
}

void	ft_fill_map(t_map *map, int fd)
{
	char	*line;
	bool	read_map;
	int		count;

	count = 0;
	read_map = false;
	while (1)
	{
		count++;
		line = get_next_line(fd);
		if (!line)
			break ;
		line = ft_free_to_trim(line, "\t\n\r");
		if (ft_is_line_valid(line))
		{
			read_map = true;
			map->mat = ft_strsjoin(map->mat, ft_strdup(line));
			if ((int)ft_strlen(line) > map->wid)
				map->wid = ft_strlen(line);
			map->hei++;
		}
		else if (read_map)
			ft_error("Map not valid", NULL);
		free(line);
	}
}

void	ft_normalise_map(t_map map)
{
	int	i;
	int	j;

	i = -1;
	while (++i < map.hei)
	{
		j = ft_strlen(map.mat[i]);
		while (j < map.wid)
		{
			map.mat[i] = ft_charjoin(map.mat[i], ' ');
			j++;
		}
	}
}
