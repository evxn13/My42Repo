/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   push_swap_utils_2.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/30 15:19:34 by evscheid          #+#    #+#             */
/*   Updated: 2023/04/25 17:29:41 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

void	three_arg(t_variable *var)
{
	refresh_get(var);
	if (var->a[0] == var->min2 && var->a[1] == var->min)
		sa(var);
	else if (var->a[0] == var->max && var->a[1] == var->min2)
	{
		sa(var);
		rra(var);
	}
	else if (var->a[0] == var->max && var->a[1] == var->min)
		ra(var);
	else if (var->a[0] == var->min && var->a[1] == var->max)
	{
		sa(var);
		ra(var);
	}
	else if (var->a[0] == var->min2 && var->a[1] == var->max)
		rra(var);
}

int	*print_a(t_variable *var)
{
	int	i;

	i = 0;
	while (i < var->len_a)
	{
		ft_printf("stack a [%d] = %d\n", i, var->a[i]);
		i++;
	}
	return (0);
}

int	*print_b(t_variable *var)
{
	int	i;

	i = 0;
	while (i < var->len_b)
	{
		ft_printf("stack b [%d] = %d\n", i, var->b[i]);
		i++;
	}
	return (0);
}

void	sb(t_variable *var)
{
	int	tmp;

	tmp = var->b[0];
	var->b[0] = var->b[1];
	var->b[1] = tmp;
	ft_printf("sb\n");
}
