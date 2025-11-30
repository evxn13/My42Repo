/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strlcpy.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/08 23:11:17 by evscheid          #+#    #+#             */
/*   Updated: 2022/11/10 11:49:18 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"
#include <stdio.h>
#include <string.h>

size_t	ft_strlcpy(char *dst, const char *src, size_t size)
{
	if (size > 0 && dst && src)
	{
		if (size > ft_strlen(src))
			size = ft_strlen(src) + 1;
		ft_memmove(dst, src, size - 1);
		dst[size - 1] = 0;
	}
	return (ft_strlen(src));
}

// int main()
// {
// 	char *bye;
// 	char *slt;

// 	slt = strdup("oksalutclafete");
// 	bye = malloc(sizeof(char) * 1000);
// 	bye[8] = 0;
// 	printf("%s\n", bye);
// 	printf("%lu\n", strlcpy(bye, slt, 45456454));
// 	printf("%s\n", bye);
// }
