/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mlx_init.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/09 16:08:06 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/09 16:08:06 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

t_ray	ft_init_ray(void)
{
	t_ray	ray;

	ray.camera_x = 0;
	ray.ray_dir_x = 0;
	ray.ray_dir_y = 0;
	ray.map_x = 0;
	ray.map_y = 0;
	ray.side_dist_x = 0;
	ray.side_dist_y = 0;
	ray.delta_dist_x = 0;
	ray.delta_dist_y = 0;
	ray.perp_wall_dist = 0;
	ray.step_x = 0;
	ray.step_y = 0;
	ray.hit = false;
	ray.side = false;
	ray.line_height = 0;
	ray.draw_start = 0;
	ray.draw_end = 0;
	ray.wall_x = 0;
	ray.tex_x = 0;
	ray.tex_y = 0;
	ray.step = 0;
	ray.tex_pos = 0;
	return (ray);
}

t_mlx	ft_mlx_init(char *filepath)
{
	t_mlx	mlx;
	char	*banner;

	banner = ft_strjoin("Scheid Rheyer CUBE 3D : ", filepath);
	mlx.mlx_ptr = mlx_init();
	if (!mlx.mlx_ptr)
		ft_error("Mlx init error", NULL);
	mlx.win_ptr = mlx_new_window(mlx.mlx_ptr, WIN_WIDTH, WIN_HEIGHT, banner);
	if (!mlx.win_ptr)
		ft_error("Mlx window init error", NULL);
	mlx.img_ptr = mlx_new_image(mlx.mlx_ptr, WIN_WIDTH, WIN_HEIGHT);
	if (!mlx.img_ptr)
		ft_error("Mlx image init error", NULL);
	mlx.addr = mlx_get_data_addr(
			mlx.img_ptr, &mlx.bits_per_pixel, &mlx.line_length, &mlx.endian);
	if (!mlx.addr)
		ft_error("Mlx image address init error", NULL);
	free(banner);
	return (mlx);
}

t_cub	*ft_cub_init(char *filepath)
{
	t_cub	*cub;

	cub = ft_calloc(1, sizeof(t_cub));
	if (!cub)
		ft_error("Malloc error", NULL);
	cub->mlx = ft_mlx_init(filepath);
	cub->texture = ft_parse_texture(cub, filepath);
	cub->map = ft_map_parser(filepath);
	cub->player = ft_init_player(cub->map);
	cub->ray = ft_init_ray();
	cub->filepath = filepath;
	return (cub);
}
