/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   color_init.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/13 22:08:53 by marvin            #+#    #+#             */
/*   Updated: 2023/11/13 22:08:53 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

int	*ft_rgb_scanner(char *id, char *line)
{
	int		*rgb;
	char	**str;

	rgb = malloc(sizeof(int) * 3);
	while (*line == ' ')
		line++;
	if (ft_strncmp(line, id, ft_strlen(id)))
		ft_error("Color identifier not valid", NULL);
	line += ft_strlen(id);
	str = ft_split(line, ',');
	if (ft_strslen(str) != 3)
		ft_error("Color not valid", NULL);
	rgb[0] = ft_atoi(str[0]);
	rgb[1] = ft_atoi(str[1]);
	rgb[2] = ft_atoi(str[2]);
	ft_free_strs(str);
	return (rgb);
}

bool	ft_is_valid_color(int r, int g, int b)
{
	if (r < 0 || r > 255)
		return (false);
	if (g < 0 || g > 255)
		return (false);
	if (b < 0 || b > 255)
		return (false);
	return (true);
}

int	ft_get_c(int a, int r, int g, int b)
{
	return (a << 24 | r << 16 | g << 8 | b);
}

void	ft_parse_color(t_texture *texture, char *line)
{
	int	*color;

	if (line[0] == 'C')
	{
		if (texture->ceiling != -1)
			ft_error("Ceiling color already set", NULL);
		color = ft_rgb_scanner("C", line);
		if (!ft_is_valid_color(color[0], color[1], color[2]))
			ft_error("Invalid color color", NULL);
		texture->ceiling = ft_get_c(0, color[0], color[1], color[2]);
		free(color);
	}
	if (line[0] == 'F')
	{
		if (texture->floor != -1)
			ft_error("Floor color already set", NULL);
		color = ft_rgb_scanner("F", line);
		if (!ft_is_valid_color(color[0], color[1], color[2]))
			ft_error("Invalid floor color", NULL);
		texture->floor = ft_get_c(0, color[0], color[1], color[2]);
		free(color);
	}
}
