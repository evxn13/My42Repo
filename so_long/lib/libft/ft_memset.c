/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_memset.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/07 17:56:24 by evscheid          #+#    #+#             */
/*   Updated: 2022/11/13 22:20:18 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	*ft_memset(void *s, int c, size_t n)
{
	char	*temp;

	temp = s;
	while (n > 0)
	{
		*temp = c;
		n--;
		if (n)
			temp++;
	}
	return (s);
}
/*
int main(void)
{
	char	str[256] = "hello world";

	printf("After memset():  %s\n", ft_memset(str + 0, '.', 1*sizeof(char)));
}*/