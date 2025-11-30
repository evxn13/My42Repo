/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   print_bottom_wall.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:56:23 by evscheid          #+#    #+#             */
/*   Updated: 2023/02/26 21:55:27 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	print_bottom_wall(t_game *game)
{
	int	i;
	int	j;

	i = game->height;
	j = 0;
	while (j < game->width)
	{
		print_image(game, game->img.bottom_wall, j - 32, i - HAUTEUR);
		j += 454;
	}
}
