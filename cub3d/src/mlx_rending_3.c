/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mlx_rending_3.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/27 16:24:25 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/27 16:31:59 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

int	ft_pixel_color(t_mlx *mlx, int x, int y)
{
	char	*dst;

	dst = mlx->addr + (y * mlx->line_length + x
			* (mlx->bits_per_pixel / 8));
	return (*(unsigned int *)dst);
}

void	ft_print_texture(t_cub *cub, int dir, int i)
{
	int	color;

	color = ft_pixel_color(&cub->texture.mlx_textures[dir],
			cub->ray.tex_x, cub->ray.tex_y);
	ft_mlx_pixel_put(cub, i, cub->ray.draw_start, color);
}

void	ft_texture_position(t_cub *cub)
{
	t_ray	*ray;

	ray = &cub->ray;
	if (!ray->side)
		ray->wall_x = cub->player.pos_y + ray->perp_wall_dist * ray->ray_dir_y;
	else
		ray->wall_x = cub->player.pos_x + ray->perp_wall_dist * ray->ray_dir_x;
	ray->wall_x -= floor(ray->wall_x);
	ray->tex_x = ray->wall_x * TEX_WIDTH;
	if (!ray->side && ray->ray_dir_x > 0)
		ray->tex_x = TEX_WIDTH - ray->tex_x - 1;
	if (ray->side && ray->ray_dir_y < 0)
		ray->tex_x = TEX_WIDTH - ray->tex_x - 1;
	ray->step = 1.0 * TEX_HEIGHT / ray->line_height;
	ray->tex_pos = (ray->draw_start - WIN_HEIGHT / 2 + ray->line_height / 2)
		* ray->step;
}

void	ft_print_background(t_cub *cub, int i, int start)
{
	int	j;

	j = -1;
	while (++j < WIN_HEIGHT)
	{
		if (j <= start)
			ft_mlx_pixel_put(cub, i, j, cub->texture.ceiling);
		else
			ft_mlx_pixel_put(cub, i, j, cub->texture.floor);
	}
}

void	ft_draw_texture(t_cub *cub, int i)
{
	t_ray	*ray;

	ray = &cub->ray;
	ft_texture_position(cub);
	ft_print_background(cub, i, ray->draw_start);
	while (ray->draw_start++ < ray->draw_end)
	{
		ray->tex_y = (int)ray->tex_pos & (TEX_HEIGHT - 1);
		ray->tex_pos += ray->step;
		if (!ray->side && cub->player.pos_x < ray->map_x)
			ft_print_texture(cub, SOUTH, i);
		else if (!ray->side && cub->player.pos_x > ray->map_x)
			ft_print_texture(cub, NORTH, i);
		else if (ray->side && cub->player.pos_y < ray->map_y)
			ft_print_texture(cub, EAST, i);
		else if (ray->side && cub->player.pos_y > ray->map_y)
			ft_print_texture(cub, WEST, i);
	}
}
