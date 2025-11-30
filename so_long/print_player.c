/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   print_player.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:58:38 by evscheid          #+#    #+#             */
/*   Updated: 2023/02/25 17:51:30 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	print_player(t_game *game, void *image, int x, int y)
{
	mlx_put_image_to_window(game->mlx_ptr, game->win_ptr, image, x +42, y + 10);
}
