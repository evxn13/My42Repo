/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   player_init.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/13 22:10:32 by marvin            #+#    #+#             */
/*   Updated: 2023/11/13 22:10:32 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

t_player	ft_init_player(t_map map)
{
	t_player	player;
	int			tmp;

	tmp = map.p_x;
	map.p_x = map.p_y;
	map.p_y = tmp;
	player.plane_x = 0;
	player.plane_y = 0;
	map.p_dir = ft_find_map_dir(&map);
	if (map.p_dir == 'N')
	{
		player.dir_x = -1;
		player.dir_y = 0;
		player.plane_y = 0.66;
	}
	else if (map.p_dir == 'S')
	{
		player.dir_x = 1;
		player.dir_y = 0;
		player.plane_y = -0.66;
	}
	return (ft_init_player_bis(map, player));
}

t_player	ft_init_player_bis(t_map map, t_player player)
{
	if (map.p_dir == 'E')
	{
		player.dir_x = 0;
		player.dir_y = 1;
		player.plane_x = 0.66;
	}
	else if (map.p_dir == 'W')
	{
		player.dir_x = 0;
		player.dir_y = -1;
		player.plane_x = -0.66;
	}
	player.pos_x = map.p_x + 0.5;
	player.pos_y = map.p_y + 0.5;
	player.old_dir_x = 0;
	player.old_plane_x = 0;
	return (player);
}

void	ft_find_player(t_map *map)
{
	int	i;
	int	j;

	i = -1;
	while (++i < map->hei)
	{
		j = -1;
		while (++j < ft_strlen(map->mat[i]))
		{
			if (map->mat[i][j] == 'N' || map->mat[i][j] == 'S'
				|| map->mat[i][j] == 'E' || map->mat[i][j] == 'W')
			{
				map->p_x = j;
				map->p_y = i;
				map->p_dir = map->mat[i][j];
				return ;
			}
		}
	}
}

int	ft_direction_id(char *identifier)
{
	if (ft_strncmp(identifier, "NO ", 3) == 0)
		return (NORTH);
	if (ft_strncmp(identifier, "SO ", 3) == 0)
		return (SOUTH);
	if (ft_strncmp(identifier, "WE ", 3) == 0)
		return (WEST);
	if (ft_strncmp(identifier, "EA ", 3) == 0)
		return (EAST);
	return (-1);
}
