/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   print_top_wall.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:55:59 by evscheid          #+#    #+#             */
/*   Updated: 2023/02/25 17:51:47 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	print_top_wall(t_game *game)
{
	int	j;

	j = 0;
	while (j < game->width)
	{
		print_image(game, game->img.top_wall, j - 32, 0);
		j += 454;
	}
}
