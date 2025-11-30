/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_putnbr_fd.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/14 20:49:16 by evscheid          #+#    #+#             */
/*   Updated: 2022/11/14 21:21:15 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	ft_putnbr_fd(int nb, int fd)
{
	if (nb == -2147483648)
	{
		ft_putnbr_fd(nb / 10, fd);
		ft_putchar_fd('8', fd);
	}
	else if (nb < 0)
	{
		ft_putchar_fd('-', fd);
		ft_putnbr_fd(-nb, fd);
	}
	else
	{
		if (nb > 9)
			ft_putnbr_fd(nb / 10, fd);
		ft_putchar_fd(48 + nb % 10, fd);
	}
}

// int		main(void)
// {
// 	ft_putnbr_fd(-42, 1);
// 	printf("\n");
// 	ft_putnbr_fd(42, 1);
// 	printf("\n");
// 	ft_putnbr_fd(-2147483648, 1);
// 	printf("\n");
// 	ft_putnbr_fd(2147483647, 1);
// 	printf("\n");
// }