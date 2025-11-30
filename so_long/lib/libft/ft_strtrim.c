/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strtrim.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/20 23:27:21 by evscheid          #+#    #+#             */
/*   Updated: 2022/11/20 23:42:16 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

static int	ft_debut(char const *s1, char const *set)
{
	int	i;

	i = 0;
	while (s1[i])
	{
		if (ft_strchr(set, s1[i]) == 0)
			return (i);
		i++;
	}
	return (i);
}

static int	ft_fin(char const *s1, char const *set)
{
	int	i;
	int	l;

	i = 0;
	l = ft_strlen(s1);
	while (s1[i])
	{
		if (ft_strchr(set, s1[l - 1]) == 0)
			return (l);
		l--;
		i++;
	}
	return (l);
}

char	*ft_strtrim(char const *s1, char const *set)
{
	int		debut;
	int		fin;
	int		dif;
	char	*dif_str;
	int		i;

	i = 0;
	if (!s1 || !set)
		return (NULL);
	debut = ft_debut(s1, set);
	fin = (ft_fin(s1, set));
	dif = (fin - debut);
	if (fin <= debut)
		dif = 0;
	dif_str = malloc(sizeof(char) * dif + 1);
	if (!dif_str)
		return (NULL);
	while (debut < fin)
	{
		dif_str[i++] = s1[debut++];
	}
	dif_str[i] = '\0';
	return (dif_str);
}
