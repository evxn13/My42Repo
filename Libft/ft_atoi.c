/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_atoi.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/09 12:43:55 by evscheid          #+#    #+#             */
/*   Updated: 2022/11/12 00:09:04 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

int	ft_atoi(const char *s)
{
	int	sign;
	int	all;
	int	i;

	i = 0;
	all = 0;
	sign = 1;
	while (s[i] == ' ' || s[i] == '\n' || s[i] == '\v'
		|| s[i] == '\t' || s[i] == '\r' || s[i] == '\f')
		i++;
	if (s[i] == '+' || s[i] == '-')
	{
		if (s[i] == '-')
			sign *= -1;
		i++;
	}
	while ((s[i] >= '0') && (s[i] <= '9'))
	{
		all = all * 10 + s[i] - '0';
		i++;
	}
	return (all * sign);
}

// int	main(void)
// {
// 	printf("42:%d\n", ft_atoi("  \n  42t4457"));
// 	printf("-42:%d\n", ft_atoi(" --+42sfs:f545"));
// 	printf("0:%d\n", ft_atoi("\0 1337"));
// 	printf("0:%d\n", ft_atoi("-0"));
// 	printf("0:%d\n", ft_atoi(" - 1 3 2 5 6 3 2 1 6 7"));
// 	printf("-1325632167:%d\n", ft_atoi("-1325632167"));
// 	printf("-100:%d\n", ft_atoi("-100"));
// 	printf("min:%d\n", ft_atoi("\t---+2147483648"));
// 	printf("max:%d\n", ft_atoi("\v2147483647"));
// }