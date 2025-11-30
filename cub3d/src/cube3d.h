/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cube3d.h                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/07 19:08:05 by marvin            #+#    #+#             */
/*   Updated: 2023/11/07 19:08:05 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef CUBE3D_H
# define CUBE3D_H

# include "../minilibx-linux/mlx.h"
# include "./gnl/get_next_line.h"
# include <stdio.h>
# include <fcntl.h>
# include <stdlib.h>
# include <stdint.h>
# include <unistd.h>
# include <math.h>
# include <stdbool.h>

# define WIN_WIDTH		1280	
# define WIN_HEIGHT		800
# define TEX_WIDTH		64
# define TEX_HEIGHT		64

# define KEY_ESC 65307
# define TILE_SIZE 64

# define NORTH		0
# define SOUTH		1
# define WEST		2
# define EAST		3

# define SPEED		0.190
# define ROTATION 	0.095

# define KEY_W		119
# define KEY_S		115
# define KEY_A		97
# define KEY_D		100

# define KEY_RIGHT	65361
# define KEY_LEFT	65363

typedef struct s_mlx
{
	void	*mlx_ptr;
	void	*win_ptr;
	void	*img_ptr;
	char	*addr;
	int		bits_per_pixel;
	int		line_length;
	int		endian;
}	t_mlx;

typedef struct s_texture
{
	t_mlx	*mlx_textures;
	int		floor;
	int		ceiling;
	void	*no;
	void	*so;
	void	*we;
	void	*ea;
	int		f;
	int		c;

}	t_texture;

typedef struct s_ray
{
	double	camera_x;
	double	ray_dir_x;
	double	ray_dir_y;
	int		map_x;
	int		map_y;
	double	side_dist_x;
	double	side_dist_y;
	double	delta_dist_x;
	double	delta_dist_y;
	double	perp_wall_dist;
	int		step_x;
	int		step_y;
	bool	hit;
	bool	side;
	int		line_height;
	int		draw_start;
	int		draw_end;
	double	wall_x;
	int		tex_x;
	int		tex_y;
	double	step;
	double	tex_pos;
}	t_ray;

typedef struct s_player
{
	double	x;
	double	y;
	double	dir_x;
	double	dir_y;
	double	plane_x;
	double	plane_y;
	double	pos_x;
	double	pos_y;
	double	old_dir_x;
	double	old_dir_y;
	double	old_plane_x;
	double	old_plane_y;
}				t_player;

typedef struct s_map
{
	char	**mat;
	int		p_x;
	int		p_y;
	char	p_dir;
	int		wid;
	int		hei;
}	t_map;

typedef struct s_cub
{
	t_mlx		mlx;
	t_player	player;
	t_map		map;
	t_texture	texture;
	t_ray		ray;
	char		*filepath;
}	t_cub;

/*   main   */
void		ft_print_tab(char **tab);
int			ft_close(t_cub *cub);

/*   mlx_init   */
t_ray		ft_init_ray(void);
t_mlx		ft_mlx_init(char *filepath);
t_cub		*ft_cub_init(char *filepath);

/*   map_init   */
t_map		ft_map_init_cub(void);
t_map		ft_map_parser(char *path);
void		ft_fill_map(t_map *map, int fd);

/*   texture_init   */
void		ft_texture_init(t_texture *texture);
char		*ft_get_ext(char *filename);
void		ft_parse_path_texture(
				t_cub *cub, t_texture texture, char *line, int dir);
void		ft_check_textures(t_texture textures);
t_texture	ft_parse_texture(t_cub *cub, char *filepath);

/*   color_init   */
int			*ft_rgb_scanner(char *id, char *line);
bool		ft_is_valid_color(int r, int g, int b);
int			ft_get_c(int a, int r, int g, int b);
void		ft_parse_color(t_texture *texture, char *line);

/*   player_init   */
t_player	ft_init_player(t_map map);
t_player	ft_init_player_bis(t_map map, t_player player);
void		ft_find_player(t_map *map);
int			ft_direction_id(char *identifier);

/*   valid_map_1   */
bool		ft_is_line_valid(char *line);
void		ft_valid_matrix(t_map map);
void		ft_valid_map(t_map map);
void		ft_chek_map_1(t_map *map);
void		ft_chek_map_2(t_map *map, int i, int j);

/*   mlx_rending   */
double		ft_fabs(double i);
void		ft_dda(t_cub *cub);
void		ft_init_ray_2(t_cub *cub, int i);
void		ft_assign_dda(t_cub *cub);
void		ft_line_height(t_cub *cub);
int			ft_pixel_color(t_mlx *mlx, int x, int y);
void		ft_print_texture(t_cub *cub, int dir, int i);
void		ft_texture_position(t_cub *cub);
void		ft_print_background(t_cub *cub, int i, int start);
void		ft_draw_texture(t_cub *cub, int i);
void		ft_raycast(t_cub *cub);
int			ft_mlx_rending(t_cub *cub);

/*   control_1   */
bool		ft_wall(float x, float y, t_cub *cub);
void		ft_rotate_left(int code, t_cub *cub);
void		ft_rotate_right(int code, t_cub *cub);
int			ft_key_press(int keycode, t_cub *cub);

/*   control_2   */
void		ft_move_up(int code, t_cub *cub);
void		ft_move_down(int code, t_cub *cub);
void		ft_move_left(int code, t_cub *cub);
void		ft_move_right(int code, t_cub *cub);

/*   mlx_utils   */
void		ft_mlx_pixel_put(t_cub *cub, int x, int y, int color);
void		ft_free_strs(char **strs);
char		*ft_strjoin(char *s1, char *s2);

/*   utils1   */
int			ft_strslen(char **tab);
void		*ft_calloc(size_t count, size_t size);
char		*ft_charjoin(char *s1, char s2);
void		ft_error(char *str, t_map *map);
int			ft_atoi(char *s);

/*   utils2   */
size_t		ft_split_len(char *s, char c);
size_t		ft_number_word(char *str, char c);
char		**ft_split(char *s, char c);
char		**ft_strsjoin(char **strs, char *str);
char		*ft_strtrim(char *s1, const char *set);

/*   utils3   */
char		*ft_free_to_trim(char *s1, char *set);
int			ft_is_set(char c, const char *set);
int			ft_strncmp(const char *s1, const char *s2, size_t n);
char		ft_find_map_dir(t_map *map);
bool		ft_is_valid_map_char(char c);

#endif
