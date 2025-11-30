/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   print_floor.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:55:25 by evscheid          #+#    #+#             */
/*   Updated: 2023/02/25 17:50:57 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	print_floor(t_game *game)
{
	int	i;
	int	j;

	i = 1;
	while (game->map[i + 1])
	{
		j = 1;
		while (game->map[i + 1][j + 1])
		{
			print_image(game, game->img.floor, j * LONGUEUR, i * HAUTEUR);
			j ++;
		}
		i++;
	}
}
