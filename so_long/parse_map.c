/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parse_map.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/27 00:59:14 by evscheid          #+#    #+#             */
/*   Updated: 2023/06/26 18:54:00 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	parse_collect(t_game *game)
{
	int	i;
	int	j;
	int	col;

	i = 0;
	j = 0;
	col = 0;
	while (game->map[i])
	{
		j = 0;
		while (game->map[i][j])
		{
			if (game->map[i][j] == 'C')
				col++;
			j++;
		}
		i++;
	}
	if (col == 0)
	{
		ft_printf("Error\n(Missing Collectible 🚨).\n");
		exit (-128);
	}
}

void	parse_content(t_game *game)
{
	int	i;
	int	j;
	int	col;

	i = 0;
	j = 0;
	col = 0;
	while (game->map[i])
	{
		j = 0;
		while (game->map[i][j])
		{
			if (game->map[i][j] != '0'
				&& game->map[i][j] != '1'
					&& game->map[i][j] != 'P'
						&& game->map[i][j] != 'E'
							&& game->map[i][j] != 'C')
			{
				ft_printf("Error\n(Invalide Content in Map 🚨).\n");
				exit (-128);
			}
			j++;
		}
		i++;
	}
}

void	parse_exit(t_game *game)
{
	int	i;
	int	j;
	int	col;

	i = 0;
	j = 0;
	col = 0;
	while (game->map[i])
	{
		j = 0;
		while (game->map[i][j])
		{
			if (game->map[i][j] == 'E')
				col++;
			j++;
		}
		i++;
	}
	if (col == 0)
	{
		ft_printf("Error\n(Missing Exit 🚨).\n");
		exit (-128);
	}
}

void	parse_wall(t_game *game)
{
	int	i;
	int	j;

	i = 0;
	j = 0;
	while (game->map[i])
	{
		j = 0;
		if (game->map[i][0] != '1')
		{
			ft_printf("Error\n(Missing Wall 🚨).\n");
			exit (-128);
		}
		while (game->map[i][j])
		{
			j++;
		}
		if (game->map[i][j - 1] != '1')
		{
			ft_printf("Error\n(Missing Wall 🚨).\n");
			exit (-128);
		}
		i++;
	}
}

void	parse_map(t_game *game)
{
	parse_collect(game);
	parse_wall(game);
	parse_exit(game);
	parse_content(game);
}
