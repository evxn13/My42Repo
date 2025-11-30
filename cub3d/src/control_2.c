/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   control_2.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/13 19:47:18 by marvin            #+#    #+#             */
/*   Updated: 2023/11/13 19:47:18 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

void	ft_move_up(int code, t_cub *cub)
{
	if (code == KEY_W)
	{
		if (ft_wall(cub->player.pos_x + cub->player.dir_x
				* (SPEED + 0.1), cub->player.pos_y, cub))
			cub->player.pos_x += cub->player.dir_x * SPEED;
		if (ft_wall(cub->player.pos_x, cub->player.pos_y
				+ cub->player.dir_y * (SPEED + 0.1), cub))
			cub->player.pos_y += cub->player.dir_y * SPEED;
	}
}

void	ft_move_down(int code, t_cub *cub)
{
	if (code == KEY_S)
	{
		if (ft_wall(cub->player.pos_x - cub->player.dir_x
				* (SPEED + 0.1), cub->player.pos_y, cub))
			cub->player.pos_x -= cub->player.dir_x * SPEED;
		if (ft_wall(cub->player.pos_x, cub->player.pos_y
				- cub->player.dir_y * (SPEED + 0.1), cub))
			cub->player.pos_y -= cub->player.dir_y * SPEED;
	}
}

void	ft_move_left(int code, t_cub *cub)
{
	if (code == KEY_A)
	{
		if (ft_wall(cub->player.pos_x - cub->player.dir_y
				* (SPEED + 0.1), cub->player.pos_y, cub))
			cub->player.pos_x -= cub->player.dir_y * SPEED;
		if (ft_wall(cub->player.pos_x, cub->player.pos_y
				+ cub->player.dir_x * (SPEED + 0.1), cub))
			cub->player.pos_y += cub->player.dir_x * SPEED;
	}
}

void	ft_move_right(int code, t_cub *cub)
{
	if (code == KEY_D)
	{
		if (ft_wall(cub->player.pos_x + cub->player.dir_y
				* (SPEED + 0.1), cub->player.pos_y, cub))
			cub->player.pos_x += cub->player.dir_y * SPEED;
		if (ft_wall(cub->player.pos_x, cub->player.pos_y
				- cub->player.dir_x * (SPEED + 0.1), cub))
			cub->player.pos_y -= cub->player.dir_x * SPEED;
	}
}
