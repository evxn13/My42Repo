/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_control.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/11 14:58:53 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/11 14:58:53 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

bool	ft_wall(float x, float y, t_cub *cub)
{
	char	**map;

	if (!cub->map.mat)
		ft_error("Map not found", NULL);
	map = cub->map.mat;
	if (map[(int)x][(int)y] == '1')
		return (false);
	return (true);
}

void	ft_rotate_left(int code, t_cub *cub)
{
	if (code == KEY_LEFT)
	{
		cub->player.old_dir_x = cub->player.dir_x;
		cub->player.dir_x = cub->player.dir_x
			* cos(-ROTATION) - cub->player.dir_y * sin(-ROTATION);
		cub->player.dir_y = cub->player.old_dir_x
			* sin(-ROTATION) + cub->player.dir_y * cos(-ROTATION);
		cub->player.old_plane_x = cub->player.plane_x;
		cub->player.plane_x = cub->player.plane_x
			* cos(-ROTATION) - cub->player.plane_y * sin(-ROTATION);
		cub->player.plane_y = cub->player.old_plane_x
			* sin(-ROTATION) + cub->player.plane_y * cos(-ROTATION);
	}
}

void	ft_rotate_right(int code, t_cub *cub)
{
	if (code == KEY_RIGHT)
	{
		cub->player.old_dir_x = cub->player.dir_x;
		cub->player.dir_x = cub->player.dir_x
			* cos(ROTATION) - cub->player.dir_y * sin(ROTATION);
		cub->player.dir_y = cub->player.old_dir_x
			* sin(ROTATION) + cub->player.dir_y * cos(ROTATION);
		cub->player.old_plane_x = cub->player.plane_x;
		cub->player.plane_x = cub->player.plane_x
			* cos(ROTATION) - cub->player.plane_y * sin(ROTATION);
		cub->player.plane_y = cub->player.old_plane_x
			* sin(ROTATION) + cub->player.plane_y * cos(ROTATION);
	}
}

int	ft_key_press(int code, t_cub *cub)
{
	if (code == KEY_ESC)
		ft_close(cub);
	ft_move_up(code, cub);
	ft_move_down(code, cub);
	ft_move_left(code, cub);
	ft_move_right(code, cub);
	ft_rotate_left(code, cub);
	ft_rotate_right(code, cub);
	ft_mlx_rending(cub);
	return (0);
}
