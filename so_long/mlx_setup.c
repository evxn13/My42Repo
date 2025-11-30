/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mlx_setup.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/01 09:48:36 by evscheid          #+#    #+#             */
/*   Updated: 2023/06/26 19:08:02 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

int	ft_zebi(t_game *game)
{
	(void) game;
	exit(0);
	return (0);
}

void	mlx_setup(t_game *game)
{
	game->width = parse_longueur(game) * LONGUEUR;
	game->height = parse_hauteur(game) * HAUTEUR;
	game->mlx_ptr = mlx_init();
	game->win_ptr = mlx_new_window(game->mlx_ptr, game->width +63,
			game->height, "so_long_Amoung_Us.");
	init(game);
	background(game);
	mlx_hook(game->win_ptr, 2, 0, &key_press, game);
	mlx_hook(game->win_ptr, 17, 0, &ft_zebi, game);
	mlx_loop(game->mlx_ptr);
}
