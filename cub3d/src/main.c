/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/05 17:15:21 by marvin            #+#    #+#             */
/*   Updated: 2023/11/05 17:15:21 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

void	ft_print_tab(char **tab)
{
	int	i;

	i = -1;
	while (tab[++i])
		printf("%s\n", tab[i]);
}

int	ft_close(t_cub *cub)
{
	if (!cub)
		return (1);
	if (cub->mlx.win_ptr)
		mlx_destroy_window(cub->mlx.mlx_ptr, cub->mlx.win_ptr);
	exit(0);
	return (0);
}

int	main(int ac, char **av)
{
	t_cub	*cub;

	if (ac != 2)
		ft_error("Wrong number of arguments", NULL);
	cub = ft_cub_init(av[1]);
	printf("Game start\n");
	ft_mlx_rending(cub);
	mlx_hook(cub->mlx.win_ptr, 2, 1L << 0, ft_key_press, cub);
	mlx_hook(cub->mlx.win_ptr, 17, 1L << 17, ft_close, cub);
	mlx_loop(cub->mlx.mlx_ptr);
	return (0);
}
