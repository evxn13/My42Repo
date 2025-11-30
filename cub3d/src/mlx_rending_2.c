/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mlx_rending_2.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/27 16:24:21 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/28 11:14:25 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

double	ft_fabs(double i)
{
	if (i < 0)
		return (-i);
	return (i);
}

void	ft_init_ray_2(t_cub *cub, int i)
{
	t_ray	*ray;

	ray = &cub->ray;
	ray->ray_dir_x = cub->player.dir_x + cub->player.plane_x
		* (2 * i / (double)WIN_WIDTH - 1);
	ray->ray_dir_y = cub->player.dir_y + cub->player.plane_y
		* (2 * i / (double)WIN_WIDTH - 1);
	ray->map_x = (int)cub->player.pos_x;
	ray->map_y = (int)cub->player.pos_y;
	if (ray->ray_dir_x == 0)
		ray->delta_dist_x = 1e30;
	else
		ray->delta_dist_x = ft_fabs(1 / ray->ray_dir_x);
	if (ray->ray_dir_y == 0)
		ray->delta_dist_y = 1e30;
	else
		ray->delta_dist_y = ft_fabs(1 / ray->ray_dir_y);
}

void	ft_dda(t_cub *cub)
{
	t_ray	*ray;

	ray = &cub->ray;
	if (ray->ray_dir_x < 0)
	{
		ray->step_x = -1;
		ray->side_dist_x = (cub->player.pos_x - ray->map_x) * ray->delta_dist_x;
	}
	else
	{
		ray->step_x = 1;
		ray->side_dist_x = (ray->map_x + 1.0 - cub->player.pos_x)
			* ray->delta_dist_x;
	}
	if (ray->ray_dir_y < 0)
	{
		ray->step_y = -1;
		ray->side_dist_y = (cub->player.pos_y - ray->map_y) * ray->delta_dist_y;
	}
	else
	{
		ray->step_y = 1;
		ray->side_dist_y = (ray->map_y + 1.0 - cub->player.pos_y)
			* ray->delta_dist_y;
	}
}

void	ft_assign_dda(t_cub *cub)
{
	t_ray	*ray;

	ray = &cub->ray;
	ray->hit = false;
	while (!ray->hit)
	{
		if (ray->side_dist_x < ray->side_dist_y)
		{
			ray->side_dist_x += ray->delta_dist_x;
			ray->map_x += ray->step_x;
			ray->side = false;
		}
		else
		{
			ray->side_dist_y += ray->delta_dist_y;
			ray->map_y += ray->step_y;
			ray->side = true;
		}
		if (cub->map.mat[ray->map_x][ray->map_y] == '1')
			ray->hit = true;
	}
	if (!ray->side)
		ray->perp_wall_dist = ray->side_dist_x - ray->delta_dist_x;
	else
		ray->perp_wall_dist = ray->side_dist_y - ray->delta_dist_y;
}

void	ft_line_height(t_cub *cub)
{
	t_ray	*ray;

	ray = &cub->ray;
	ray->line_height = (int)(WIN_HEIGHT / ray->perp_wall_dist);
	ray->draw_start = -ray->line_height / 2 + WIN_HEIGHT / 2;
	if (ray->draw_start < 0)
		ray->draw_start = 0;
	ray->draw_end = ray->line_height / 2 + WIN_HEIGHT / 2;
	if (ray->draw_end >= WIN_HEIGHT)
		ray->draw_end = WIN_HEIGHT - 1;
}
