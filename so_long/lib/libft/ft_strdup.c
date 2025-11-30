/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strdup.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/09 21:16:58 by evscheid          #+#    #+#             */
/*   Updated: 2022/11/21 00:35:16 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

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
