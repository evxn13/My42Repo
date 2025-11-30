/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   radix.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/29 14:48:17 by evscheid          #+#    #+#             */
/*   Updated: 2023/05/14 19:31:52 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

void	format_stack(t_variable *var)
{
	int	i;
	int	j;
	int	tmp;

	i = -1;
	while (++i < var->len_a)
	{
		j = var->len_b++;
		var->b[i] = var->a[i];
		while (var->b[j] < var->b[j - 1] && j)
		{
			tmp = var->b[j - 1];
			var->b[j - 1] = var->b[j];
			var->b[j] = tmp;
			j--;
		}
	}
	while (--i >= 0)
	{
		j = 0;
		while (var->a[i] != var->b[j])
			j++;
		var->a[i] = j;
	}
	var->len_b = 0;
}

void	radix_sort(t_variable *var)
{
	int	size;
	int	bit_weight;
	int	max_bit_weight;

	bit_weight = 1;
	max_bit_weight = get_max_bit_weight(var);
	while (bit_weight <= max_bit_weight)
	{
		size = var->len_a;
		while (size--)
		{
			if (var->a[0] & bit_weight)
				ra(var);
			else
				pb(var);
		}
		while (var->len_b)
			pa(var);
		bit_weight <<= 1;
	}
}

int	get_max_bit_weight(t_variable *var)
{
	int	max;
	int	bit_weight;

	bit_weight = 1;
	max = var->len_a;
	while (max > 1)
	{
		max >>= 1;
		bit_weight <<= 1;
	}
	return (bit_weight);
}
