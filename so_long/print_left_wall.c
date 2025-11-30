/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   print_left_wall.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:57:01 by evscheid          #+#    #+#             */
/*   Updated: 2023/02/25 17:51:23 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	print_left_wall(t_game *game)
{
	int	i;
	int	j;

	i = 0;
	j = 0;
	while (game->map[i])
	{
		print_image(game, game->img.left_wall, -32, j);
		j += 454;
		i++;
	}
}
