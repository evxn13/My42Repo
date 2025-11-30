/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   keypress.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:50:17 by evscheid          #+#    #+#             */
/*   Updated: 2023/06/26 19:00:40 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

static void	player_moove(int whopress, t_game *game)
{
	static int	x;
	static int	y;

	x = game->str_x;
	y = game->str_y;
	print_image(game, game->img.floor, game->player_x, game->player_y);
	if (whopress == 1)
		press_s(x, y, game);
	else if (whopress == 13)
		press_w(x, y, game);
	else if (whopress == 2)
		press_d(x, y, game);
	else if (whopress == 0)
		press_a(x, y, game);
	ft_printf("nombre de mouvement 🏃 ----------> : %d\n", game->moove_count);
}

int	key_press(int keysim, t_game *game)
{
	if (keysim == 53)
		ft_zebi(game);
	if (keysim == 16)
		exit(1);
	if (keysim == 13)
		player_moove(13, game);
	if (keysim == 0)
		player_moove(0, game);
	if (keysim == 2)
		player_moove(2, game);
	if (keysim == 1)
		player_moove(1, game);
	contour(game);
	return (0);
}
