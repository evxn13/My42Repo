/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/25 16:49:38 by evscheid          #+#    #+#             */
/*   Updated: 2023/06/26 18:56:03 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

static void	read_file(t_game *game, int fd, char *line, char *stock)
{
	char	*tmp;

	while (1)
	{
		line = get_next_line(fd);
		if (!line)
			break ;
		if (!stock)
			stock = ft_strdup(line);
		else
		{
			tmp = ft_strdup(stock);
			free(stock);
			stock = ft_strjoin(tmp, line);
		}
		if (line)
			free(line);
	}
	game->map = ft_split(stock, '\n');
	game->map_copy = ft_split(stock, '\n');
	free(stock);
	free(line);
}

static void	perror_exit(char *msg)
{
	ft_putstr_fd(msg, 2);
	exit(EXIT_FAILURE);
}

int	main(int argc, char **argv)
{
	t_game	game;
	int		fd;

	(void) argc;
	ft_bzero(&game, sizeof(t_game));
	fd = open(argv[1], O_RDONLY);
	if (open(argv[1], O_RDONLY) < 0)
		perror_exit("Error\n");
	read_file(&game, fd, NULL, NULL);
	parse_map(&game);
	count_exit(&game);
	parsing_map(&game);
	mlx_setup(&game);
	return (0);
}
