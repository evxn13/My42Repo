/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   contour.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:54:36 by evscheid          #+#    #+#             */
/*   Updated: 2023/02/25 17:13:31 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	contour(t_game *game)
{
	print_bottom_wall(game);
	print_top_wall(game);
	print_right_wall(game);
	print_left_wall(game);
	print_image(game, game->img.corner_gh, -32, 0);
	print_image(game, game->img.corner_gb, -32, game->height - HAUTEUR);
	print_image(game, game->img.corner_dh, game->width - LONGUEUR, 0);
	print_image(game, game->img.corner_db,
		game->width - LONGUEUR, game->height - HAUTEUR);
}
