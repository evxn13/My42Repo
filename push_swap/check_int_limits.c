/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   check_int_limits.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/05/14 20:09:00 by evscheid          #+#    #+#             */
/*   Updated: 2023/05/14 20:11:52 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

int	get_sign_and_move_ptr(char **str)
{
	int	sign;

	if (**str == '-')
	{
		sign = -1;
		(*str)++;
	}
	else
	{
		sign = 1;
	}
	return (sign);
}

int	convert_and_check_overflow(char *str, int *overflow)
{
	int	num;
	int	digit;

	num = 0;
	while (*str)
	{
		digit = *str - '0';
		if (num > (INT_MAX - digit) / 10)
		{
			*overflow = 1;
			break ;
		}
		num = num * 10 + digit;
		str++;
	}
	return (num);
}

void	check_int_limits(char *str, t_variable *var, int h)
{
	int	num;
	int	sign;
	int	overflow;

	overflow = 0;
	sign = get_sign_and_move_ptr(&str);
	num = convert_and_check_overflow(str, &overflow);
	if (overflow)
	{
		ft_putstr_fd("Error\n", 2);
		exit(1);
	}
	var->a[h] = num * sign;
}
