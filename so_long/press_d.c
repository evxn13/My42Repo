/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   press_d.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:52:53 by evscheid          #+#    #+#             */
/*   Updated: 2023/04/10 19:27:03 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	press_d_b(int x, int y, t_game *game)
{
	if (game->map[y][x + 1] == 'E' && game->count_c == game->count)
		exit (-128);
	else if (game->map[y][x + 1] != 'E')
	{
		game->player_x += 57;
		game->str_x++;
		game->moove_count++;
		print_image(game, game->img.floor, game->player_x,
			game->player_y);
		print_player(game, game->player.skin, game->player_x,
			game->player_y);
	}
	else
		print_player(game, game->player.skin,
			game->player_x, game->player_y);
}

void	press_d(int x, int y, t_game *game)
{
	if (game->map[y][x + 1] != '1')
	{
		if (game->map[y][x + 1] == 'C')
		{
			game->count_c++;
			game->map[y][x + 1] = '0';
			game->player_x += 57;
			game->str_x++;
			game->moove_count++;
			print_image(game, game->img.floor, game->player_x,
				game->player_y);
			print_player(game, game->player.skin, game->player_x,
				game->player_y);
		}
		else
			press_d_b(x, y, game);
	}
	else
	{
		print_image(game, game->img.floor, game->player_x,
			game->player_y);
		print_player(game, game->player.skin, game->player_x,
			game->player_y);
	}
}
