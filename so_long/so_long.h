/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   so_long.h                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/01 09:05:44 by evscheid          #+#    #+#             */
/*   Updated: 2023/06/26 19:01:14 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef SO_LONG_H
# define SO_LONG_H
# include <mlx.h>
# include <stdio.h>
# include <stdlib.h>
# include "lib/gnl/get_next_line.h"
# include "lib/libft/libft.h"
# include <sys/types.h>
# include <sys/uio.h>
# include <fcntl.h>

# ifndef LONGUEUR
#  define LONGUEUR 57
# endif

# ifndef HAUTEUR
#  define HAUTEUR 82
# endif

typedef struct s_img{
	void	*floor;
	void	*top_wall;
	void	*bottom_wall;
	void	*left_wall;
	void	*right_wall;
	void	*space_background;
	void	*corner_gh;
	void	*corner_gb;
	void	*corner_dh;
	void	*corner_db;
	void	*obstacle;
	void	*dead_body;
	void	*vent;
}					t_img;

typedef struct s_player{
	void	*skin;	
}					t_player;

typedef struct s_game {
	int			fd;
	int			count_c;
	void		*mlx_ptr;
	void		*win_ptr;
	int			player_x;
	int			player_y;
	int			str_x;
	int			str_y;
	int			x;
	int			y;
	int			height;
	int			width;
	int			blabla;
	int			bloblo;
	int			frame;
	int			map_height;
	int			map_width;
	int			verif;
	int			moove_count;
	int			input_w;
	int			input_a;
	int			input_s;
	int			input_d;
	int			count;
	char		**map_copy;
	char		**map;
	t_img		img;
	t_player	player;
}					t_game;

typedef struct s_update_params
{
	t_game	*game;
	size_t	x;
	size_t	y;
	int		*r;
	char	c;
}				t_update_params;

void		mlx_setup(t_game *game);
int			key_press(int keysim, t_game *game);
int			run(t_game *game);
int			background(t_game *game);
void		contour(t_game *game);
void		init(t_game *game);
int			path_find(t_game *game);
int			key_press(int keysim, t_game *game);
void		mlx_setup(t_game *game);
int			parse_hauteur(t_game *game);
int			parse_longueur(t_game *game);
void		player_setup(t_game *game);
void		press_a(int x, int y, t_game *game);
void		press_d(int x, int y, t_game *game);
void		press_s(int x, int y, t_game *game);
void		press_w(int x, int y, t_game *game);
void		print_bottom_wall(t_game *game);
void		print_floor(t_game *game);
void		print_image(t_game *game, void *image, int x, int y);
void		print_left_wall(t_game *game);
void		print_player(t_game *game, void *image, int x, int y);
void		print_right_wall(t_game *game);
void		print_top_wall(t_game *game);
void		set_collecible(t_game *game);
void		set_exit(t_game *game);
void		set_obstacle(t_game *game);
int			path_find(t_game *game);
int			path_finding(t_game *game);
int			path(t_game *game);
void		parsing_map(t_game *game);
void		parse_map(t_game *game);
void		count_exit(t_game *game);
void		check_map(t_game *game, char c, int *r, size_t x);
void		count_exit(t_game *game);
int			ft_zebi(t_game *game);

#endif