/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 17:00:12 by evscheid          #+#    #+#             */
/*   Updated: 2023/04/10 19:20:28 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	init_b(t_game *game)
{
	game->img.left_wall = mlx_xpm_file_to_image(game->mlx_ptr,
			"./xpm/right_big_wall.xpm", &game->blabla, &game->bloblo);
	game->img.right_wall = mlx_xpm_file_to_image(game->mlx_ptr,
			"./xpm/left_big_wall.xpm", &game->blabla, &game->bloblo);
	game->img.corner_gh = mlx_xpm_file_to_image(game->mlx_ptr,
			"./xpm/corner_gh.xpm", &game->blabla, &game->bloblo);
	game->img.corner_gb = mlx_xpm_file_to_image(game->mlx_ptr,
			"./xpm/corner_gb.xpm", &game->blabla, &game->bloblo);
	game->img.corner_dh = mlx_xpm_file_to_image(game->mlx_ptr,
			"./xpm/corner_dh.xpm", &game->blabla, &game->bloblo);
	game->img.corner_db = mlx_xpm_file_to_image(game->mlx_ptr,
			"./xpm/corner_db.xpm", &game->blabla, &game->bloblo);
	game->img.obstacle = mlx_xpm_file_to_image(game->mlx_ptr,
			"./xpm/obstacle.xpm", &game->blabla, &game->bloblo);
	game->img.dead_body = mlx_xpm_file_to_image(game->mlx_ptr,
			"./xpm/dead_body.xpm", &game->blabla, &game->bloblo);
	game->img.vent = mlx_xpm_file_to_image(game->mlx_ptr,
			"./xpm/vent.xpm", &game->blabla, &game->bloblo);
	game->count = 0;
}

void	init(t_game *game)
{
	game->input_a = 0;
	game->input_w = 13;
	game->input_d = 2;
	game->input_s = 1;
	game->player.skin = mlx_xpm_file_to_image(game->mlx_ptr,
			"./xpm/perso_base.xpm", &game->blabla, &game->bloblo);
	game->img.floor = mlx_xpm_file_to_image(game->mlx_ptr,
			"./xpm/floorAS.xpm", &game->blabla, &game->bloblo);
	game->img.top_wall = mlx_xpm_file_to_image(game->mlx_ptr,
			"./xpm/bottom_big_wall.xpm", &game->blabla, &game->bloblo);
	game->img.bottom_wall = mlx_xpm_file_to_image(game->mlx_ptr,
			"./xpm/top_big_wall.xpm", &game->blabla, &game->bloblo);
	game->moove_count = 0;
	init_b(game);
}
