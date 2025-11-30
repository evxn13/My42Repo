/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   press_s.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:52:12 by evscheid          #+#    #+#             */
/*   Updated: 2023/06/26 18:58:38 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	press_s_b(int x, int y, t_game *game)
{
	if (game->map[y + 1][x] == 'E' && game->count_c == game->count)
		exit (-128);
	else if (game->map[y + 1][x] != 'E')
	{
		game->player_y += 82;
		game->str_y++;
		game->moove_count++;
		print_image(game, game->img.floor, game->player_x,
			game->player_y);
		print_player(game, game->player.skin, game->player_x, game->player_y);
	}
	else
		print_player(game, game->player.skin, game->player_x, game->player_y);
}

void	press_s(int x, int y, t_game *game)
{
	if (game->map[y + 1][x] != '1')
	{
		if (game->map[y + 1][x] == 'C')
		{
			game->count_c++;
			game->map[y + 1][x] = '0';
			game->player_y += 82;
			game->str_y++;
			game->moove_count++;
			print_image(game, game->img.floor, game->player_x,
				game->player_y);
			print_player(game, game->player.skin, game->player_x,
				game->player_y);
		}
		else
			press_s_b(x, y, game);
	}
	else
	{
		print_image(game, game->img.floor, game->player_x,
			game->player_y);
		print_player(game, game->player.skin, game->player_x,
			game->player_y);
	}
}
