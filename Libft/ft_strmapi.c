/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strmapi.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/15 21:43:23 by evscheid          #+#    #+#             */
/*   Updated: 2022/11/20 23:15:36 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strmapi(char const *src, char (*f)(unsigned int, char))
{
	int		i;
	char	*str;

	i = -1;
	str = malloc(ft_strlen(src) + 1);
	if (!f || !str || !src)
		return (NULL);
	while (src[++i])
		str[i] = (*f)(i, src[i]);
	str[i] = '\0';
	return (str);
}
