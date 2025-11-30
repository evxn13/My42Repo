/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   print_right_wall.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:56:42 by evscheid          #+#    #+#             */
/*   Updated: 2023/02/25 17:52:55 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	print_right_wall(t_game *game)
{
	int	i;
	int	j;

	i = 0;
	j = 0;
	while (game->map[i])
	{
		print_image(game, game->img.right_wall, game->width - LONGUEUR, j);
		j += 454;
		i++;
	}
}
