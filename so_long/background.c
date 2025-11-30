/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   background.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:54:12 by evscheid          #+#    #+#             */
/*   Updated: 2023/04/10 17:09:31 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

int	background(t_game *game)
{
	print_floor(game);
	contour(game);
	set_obstacle(game);
	set_collecible(game);
	player_setup(game);
	set_exit(game);
	return (0);
}
