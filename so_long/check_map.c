/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   check_map.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/05/15 16:58:56 by evscheid          #+#    #+#             */
/*   Updated: 2023/06/26 18:54:27 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

static void	update_map(t_update_params *params)
{
	if (params->x > 0
		&& params->game->map_copy[params->x - 1][params->y] == params->c)
	{
		*params->r = 1;
		params->game->map_copy[params->x - 1][params->y] = 'X';
	}
	if (params->game->map_copy[params->x + 1]
		&& params->game->map_copy[params->x + 1][params->y] == params->c)
	{
		*params->r = 1;
		params->game->map_copy[params->x + 1][params->y] = 'X';
	}
	if (params->y > 0
		&& params->game->map_copy[params->x][params->y - 1] == params->c)
	{
		*params->r = 1;
		params->game->map_copy[params->x][params->y - 1] = 'X';
	}
	if (params->game->map_copy[params->x][params->y + 1] == params->c)
	{
		*params->r = 1;
		params->game->map_copy[params->x][params->y + 1] = 'X';
	}
}

void	check_map(t_game *game, char c, int *r, size_t x)
{
	size_t			y;
	t_update_params	params;

	params.game = game;
	params.c = c;
	params.r = r;
	while (game->map_copy[++x])
	{
		y = 0;
		while (game->map_copy[x][y++])
		{
			if (game->map_copy[x][y] == 'P' || game->map_copy[x][y] == 'X')
			{
				params.x = x;
				params.y = y;
				update_map(&params);
			}
		}
	}
}

void	count_exit(t_game *game)
{
	int	i;
	int	j;
	int	count;

	i = 0;
	j = 0;
	count = 0;
	while (game->map_copy[j])
	{
		i = 0;
		while (game->map_copy[j][i])
		{
			if (game->map_copy[j][i] == 'E')
				count += 1;
			i++;
		}
		j++;
	}
	if (count != 1)
	{
		ft_printf("Error\n(exit 🚨).\n");
		exit (-148);
	}
}
