/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_memcpy.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/08 16:28:09 by evscheid          #+#    #+#             */
/*   Updated: 2022/11/08 18:53:04 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	*ft_memcpy(void *dest, const void *src, size_t n)
{
	size_t	i;

	i = 0;
	if (!dest && !src && n != 0)
		return (0);
	while (i < n)
	{
		((unsigned char *)dest)[i] = ((unsigned char *)src)[i];
		i++;
	}
	return (dest);
}

// int main(void)
// {
// 	char	src[256] = "hello";
// 	char	dest[256];
// 	printf("aftermemcpy : %s\n", memcpy(dest, src, 2));
// 	char	source[256] = "hello";
// 	char	desti[256];
// 	printf("ft_aftermemcpy : %s\n", ft_memcpy(desti, source, 2));
// 	printf("source : %s\n", desti);
// 	printf("dest : %s\n", desti);

// }