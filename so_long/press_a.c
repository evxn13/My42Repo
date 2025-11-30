/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   press_a.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:53:22 by evscheid          #+#    #+#             */
/*   Updated: 2023/04/10 19:26:44 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	press_a_b(int x, int y, t_game *game)
{
	if (game->map[y][x - 1] == 'E' && game->count_c == game->count)
		exit (-128);
	else if (game->map[y][x - 1] != 'E')
	{
		game->player_x -= 57;
		game->str_x--;
		game->moove_count++;
		print_image(game, game->img.floor, game->player_x,
			game->player_y);
		print_player(game, game->player.skin, game->player_x, game->player_y);
	}
	else
		print_player(game, game->player.skin, game->player_x, game->player_y);
}

void	press_a(int x, int y, t_game *game)
{
	if (game->map[y][x - 1] != '1')
	{
		if (game->map[y][x - 1] == 'C')
		{
			game->count_c++;
			game->map[y][x - 1] = '0';
			game->player_x -= 57;
			game->str_x--;
			game->moove_count++;
			print_image(game, game->img.floor, game->player_x,
				game->player_y);
			print_player(game, game->player.skin, game->player_x,
				game->player_y);
		}
		else
			press_a_b(x, y, game);
	}
	else
	{
		print_image(game, game->img.floor, game->player_x,
			game->player_y);
		print_player(game, game->player.skin, game->player_x,
			game->player_y);
	}
}
