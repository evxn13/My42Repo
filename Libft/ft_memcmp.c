/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_memcmp.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/12 01:59:25 by evscheid          #+#    #+#             */
/*   Updated: 2022/11/14 19:27:20 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

int	ft_memcmp(const void *s1, const void *s2, size_t n)
{
	size_t	i;

	i = 0;
	while (i < n)
	{
		if ((*(unsigned char *)(s1 + i)) != (*(unsigned char *)(s2 + i)))
			return ((*(unsigned char *)(s1 + i))
				- (*(unsigned char *)(s2 + i)));
		i++;
	}
	return (0);
}

// int main(void)
// {
// 	printf("%d\n", ft_memcmp("bonjour", "bonjoure", 7));
// }