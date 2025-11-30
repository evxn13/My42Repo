/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_mlx_rending.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/12 17:26:09 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/12 17:26:09 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

void	ft_raycast(t_cub *cub)
{
	int	i;

	i = 0;
	while (i < WIN_WIDTH)
	{
		ft_init_ray_2(cub, i);
		ft_dda(cub);
		ft_assign_dda(cub);
		ft_line_height(cub);
		ft_draw_texture(cub, i);
		i++;
	}
}

int	ft_mlx_rending(t_cub *cub)
{
	t_mlx	*mlx;

	mlx = &cub->mlx;
	mlx_destroy_image(mlx->mlx_ptr, mlx->img_ptr);
	mlx->img_ptr = mlx_new_image(mlx->mlx_ptr, WIN_WIDTH, WIN_HEIGHT);
	mlx->addr = mlx_get_data_addr(mlx->img_ptr, &mlx->bits_per_pixel,
			&mlx->line_length, &mlx->endian);
	ft_raycast(cub);
	mlx_put_image_to_window(mlx->mlx_ptr, mlx->win_ptr, mlx->img_ptr, 0, 0);
	return (0);
}
