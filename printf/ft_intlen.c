/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_intlen.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/12/01 17:25:19 by evscheid          #+#    #+#             */
/*   Updated: 2022/12/01 17:25:19 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_printf.h"

int	ft_intlen(unsigned int n, int base)
{
	int	i;

	i = 0;
	if (!n)
		return (1);
	while (n > 0)
	{
		n /= base;
		i++;
	}
	return (i);
}
