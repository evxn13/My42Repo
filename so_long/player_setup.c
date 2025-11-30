/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   player_setup.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:55:01 by evscheid          #+#    #+#             */
/*   Updated: 2023/02/26 21:34:48 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	player_setup(t_game *game)
{
	int	i;
	int	j;

	i = 1;
	while (game->map[i + 1])
	{
		j = 1;
		while (game->map[i + 1][j + 1])
		{
			if (game->map[i][j] == 'P')
			{
				print_player(game, game->player.skin,
					j * LONGUEUR, i * HAUTEUR);
				game->player_x = j * LONGUEUR;
				game->player_y = i * HAUTEUR;
				game->str_x = j;
				game->str_y = i;
			}
			j++;
		}
		i++;
	}
}
