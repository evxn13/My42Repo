/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   texture_init.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/13 22:03:58 by marvin            #+#    #+#             */
/*   Updated: 2023/11/13 22:03:58 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

void	ft_texture_init(t_texture *texture)
{
	texture->mlx_textures = malloc(sizeof(t_mlx) * 5);
	if (!texture->mlx_textures)
		ft_error("Malloc error", NULL);
	texture->floor = -1;
	texture->ceiling = -1;
	texture->mlx_textures[NORTH].img_ptr = NULL;
	texture->mlx_textures[SOUTH].img_ptr = NULL;
	texture->mlx_textures[WEST].img_ptr = NULL;
	texture->mlx_textures[EAST].img_ptr = NULL;
}

char	*ft_get_ext(char *filename)
{
	int		length;
	int		i;

	if (!filename)
		return (NULL);
	length = ft_strlen(filename);
	i = length - 1;
	while (i >= 0 && filename[i] != '.' \
		&& filename[i] != '/' && filename[i] != '\\')
		i--;
	if (i > 0 && filename[i] == '.' \
		&& filename[i - 1] != '/' && filename[i - 1] != '\\')
		return (filename + i);
	else
		return (filename + length);
}

void	ft_parse_path_texture(
		t_cub *cub, t_texture texture, char *line, int dir)
{
	void	*img;
	int		width;
	int		height;

	height = TEX_HEIGHT;
	width = TEX_WIDTH;
	if (dir == -1)
		ft_error("Texture direction not valid", NULL);
	if (texture.mlx_textures[dir].img_ptr != NULL)
		ft_error("Texture already set", NULL);
	line += 2;
	line = ft_strtrim(line, " \t\n\r");
	if (ft_strncmp(ft_get_ext(line), ".xpm", 4))
		ft_error("Texture file not valid", NULL);
	img = mlx_xpm_file_to_image(cub->mlx.mlx_ptr, line, &width, &height);
	free(line);
	if (!img)
		ft_error("Texture file not found", NULL);
	texture.mlx_textures[dir].img_ptr = img;
	texture.mlx_textures[dir].addr = mlx_get_data_addr(
			img, &texture.mlx_textures[dir].bits_per_pixel,
			&texture.mlx_textures[dir].line_length,
			&texture.mlx_textures[dir].endian);
	if (!texture.mlx_textures[dir].addr)
		ft_error("Texture image address init error", NULL);
}

void	ft_check_textures(t_texture textures)
{
	if (textures.ceiling == -1 || textures.floor == -1)
		ft_error("Missing floor or ceiling color", NULL);
	if (textures.mlx_textures[NORTH].img_ptr == NULL)
		ft_error("Missing north texture", NULL);
	if (textures.mlx_textures[SOUTH].img_ptr == NULL)
		ft_error("Missing south texture", NULL);
	if (textures.mlx_textures[WEST].img_ptr == NULL)
		ft_error("Missing west texture", NULL);
	if (textures.mlx_textures[EAST].img_ptr == NULL)
		ft_error("Missing east texture", NULL);
}

t_texture	ft_parse_texture(t_cub *cub, char *filepath)
{
	int			fd;
	char		*line;
	t_texture	texture;

	ft_texture_init(&texture);
	fd = open(filepath, O_RDONLY);
	if (fd < 0)
		ft_error("Texture file not found", NULL);
	while (1)
	{
		line = get_next_line(fd);
		if (!line)
			break ;
		line = ft_free_to_trim(line, "\t");
		if (line[0] == 'N' || line[0] == 'S'
			|| line[0] == 'W' || line[0] == 'E')
			ft_parse_path_texture(cub, texture, line, ft_direction_id(line));
		if (line[0] == 'F' || line[0] == 'C')
			ft_parse_color(&texture, line);
		free(line);
	}
	close(fd);
	ft_check_textures(texture);
	return (texture);
}
