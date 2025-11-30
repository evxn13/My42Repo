/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line_utils.c                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/12/19 16:20:57 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/28 14:27:27 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "get_next_line.h"

int	ft_strlen(const char *s)
{
	int	i;

	i = 0;
	while (s[i])
		i++;
	return (i);
}

char	*ft_strjoin_gnl(char *s1, char *s2)
{
	char	*str;
	int		i;
	int		j;

	str = (char *) malloc(sizeof(*s1) * (ft_strlen(s1) + ft_strlen(s2) + 1));
	i = 0;
	j = 0;
	if (!str)
		return (NULL);
	while (s1[i])
	{
		str[j] = s1[i];
		j++;
		i++;
	}
	i = 0;
	while (s2[i])
	{
		str[j] = s2[i];
		j++;
		i++;
	}
	str[j] = '\0';
	free(s1);
	return (str);
}

char	*ft_strchr(const char *s, int c)
{
	int	i;

	i = 0;
	while (s[i] != (char)c && s[i] != '\0')
		i++;
	if (s[i] == (char)c)
		return ((char *)s + i);
	return (NULL);
}

char	*ft_strdup(const char *src)
{
	int		i;
	int		len;
	char	*str;

	i = -1;
	len = ft_strlen(src);
	str = malloc(sizeof(char) * (len + 1));
	if (!str)
		return (0);
	while (src[++i])
		str[i] = src[i];
	str[i] = '\0';
	return (str);
}

char	*ft_substr(char const *s, unsigned int start, int len)
{
	char		*str;
	int			i;

	i = 0;
	if (len > ft_strlen(s))
		len = (ft_strlen(s) - (int)start);
	if ((int)start > ft_strlen(s))
		len = 0;
	if (!s)
		return (0);
	str = malloc(sizeof(char) * (len) + 1);
	if (!str)
		return (0);
	while (i < len)
	{
		str[i] = s[start + i];
		i++;
	}
	str[i] = '\0';
	return (str);
}
