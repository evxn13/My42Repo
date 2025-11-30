/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   path_find.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/01 23:05:01 by evscheid          #+#    #+#             */
/*   Updated: 2023/06/26 18:45:43 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	verif_map(t_game *game)
{
	int	i;
	int	j;

	i = 0;
	j = 0;
	while (game->map_copy[j])
	{
		i = 0;
		while (game->map_copy[j][i])
		{
			if (game->map_copy[j][i] == 'C' || game->map_copy[j][i] == 'E')
			{
				ft_printf("Error\n(Invalid Map 🚨).\n");
				exit (-148);
			}
			i++;
		}
		j++;
	}
}

void	check_line_length(t_game *game)
{
	int		i;
	size_t	line_length;

	i = 0;
	line_length = ft_strlen(game->map_copy[0]);
	while (game->map_copy[i])
	{
		if (ft_strlen(game->map_copy[i]) != line_length)
		{
			ft_printf("Error\n(Invalid Line Length 🚨).\n");
			exit(-148);
		}
		i++;
	}
}

void	check_walls(t_game *game)
{
	int	i;
	int	map_height;
	int	map_width;

	i = 0;
	map_height = 0;
	while (game->map_copy[map_height])
		map_height++;
	map_width = ft_strlen(game->map_copy[0]);
	while (i < map_width)
	{
		if (game->map_copy[0][i] != '1'
			|| game->map_copy[map_height - 1][i] != '1')
		{
			ft_printf("Error\n(Invalid Walls 🚨).\n");
			exit(-148);
		}
		i++;
	}
}

void	count_player(t_game *game)
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
			if (game->map_copy[j][i] == 'P')
				count += 1;
			i++;
		}
		j++;
	}
	if (count != 1)
	{
		ft_printf("Error\n(Invalid Player Count 🚨).\n");
		exit (-148);
	}
}

void	parsing_map(t_game *game)
{
	int	i;

	i = 1;
	while (i)
	{
		i = 0;
		check_map(game, '0', &i, -1);
		check_map(game, 'C', &i, -1);
	}
	check_map(game, 'E', &i, -1);
	verif_map(game);
	count_player(game);
	check_line_length(game);
	check_walls(game);
}
