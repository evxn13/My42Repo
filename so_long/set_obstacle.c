/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   set_obstacle.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:58:06 by evscheid          #+#    #+#             */
/*   Updated: 2023/02/25 17:53:19 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	set_obstacle(t_game *game)
{
	int	i;
	int	j;

	i = 1;
	while (game->map[i + 1])
	{
		j = 1;
		while (game->map[i + 1][j + 1])
		{
			if (game->map[i][j] == '1')
				print_image(game, game->img.obstacle, j * LONGUEUR,
					i * HAUTEUR);
			j++;
		}
		i++;
	}
}
