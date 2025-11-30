/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_putnbr_base.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/26 14:06:48 by evscheid          #+#    #+#             */
/*   Updated: 2023/01/14 19:21:06 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_printf.h"

size_t	ft_putnbr_base(long long int nbr, char *base)
{
	long long	n;
	int			len;

	if (nbr == 0)
	{
		ft_putchar('0');
		return (0);
	}
	n = nbr;
	len = ft_strlen(base);
	if (n < 0)
	{
		ft_putchar('-');
		n = -n;
	}
	if (n / len)
		ft_putnbr_base(n / len, base);
	ft_putchar(base[n % len]);
	return (1);
}

int	ft_int_len(long long int num)
{
	int	len;

	len = 0;
	if (num < 0)
		len++;
	while (num != 0)
	{
		len++;
		num = num / 10;
	}
	return (len);
}

int	handleint(long long int n, char *base)
{
	if (n == 0)
	{
		ft_putnbr_base(n, base);
		return (1);
	}
	ft_putnbr_base(n, base);
	return (ft_int_len(n));
}
