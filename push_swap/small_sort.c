/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   small_sort.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/27 17:18:44 by evscheid          #+#    #+#             */
/*   Updated: 2023/04/25 17:30:45 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

void	refresh(t_variable *var)
{
	get_max(var);
	get_min(var);
	get_min_2(var);
}

void	five(t_variable *var)
{
	while (1)
	{
		if (var->a[0] == var->min2 || var->a[0] == var->min)
			break ;
		ra(var);
	}
	pb(var);
	while (1)
	{
		if (var->a[0] == var->min2 || var->a[0] == var->min)
			break ;
		ra(var);
	}
	pb(var);
	if (var->b[0] == var->min)
		sb(var);
	three_arg(var);
	pa(var);
	pa(var);
}

void	small_sort(t_variable *var)
{
	refresh_get(var);
	if (var->len_a == 2 && var->a[0] > var->a[1])
		sa(var);
	else if (var->len_a == 3)
		three_arg(var);
	else if (var->len_a == 4)
	{
		while (var->a[0] != var->max)
			ra(var);
		pb(var);
		three_arg(var);
		pa(var);
		ra(var);
	}
	else if (var->len_a == 5)
		five(var);
}
