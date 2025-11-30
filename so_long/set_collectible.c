/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   set_collectible.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:57:40 by evscheid          #+#    #+#             */
/*   Updated: 2023/06/12 18:28:12 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	set_collecible(t_game *game)
{
	int	i;
	int	j;

	i = 1;
	while (game->map[i + 1])
	{
		j = 1;
		while (game->map[i + 1][j + 1])
		{
			if (game->map[i][j] == 'C')
			{
				print_player(game, game->img.dead_body, j * LONGUEUR,
					i * HAUTEUR);
				game->count++;
			}
			j++;
		}
		i++;
	}
}
