/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   set_exit.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:58:21 by evscheid          #+#    #+#             */
/*   Updated: 2023/02/25 17:52:18 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	set_exit(t_game *game)
{
	int	i;
	int	j;

	i = 1;
	while (game->map[i + 1])
	{
		j = 1;
		while (game->map[i + 1][j + 1])
		{
			if (game->map[i][j] == 'E')
			{
				print_image(game, game->img.vent, j * LONGUEUR, i * HAUTEUR);
			}
			j ++;
		}
		i++;
	}
}
