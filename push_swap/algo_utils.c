/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   algo_utils.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/27 19:53:02 by evscheid          #+#    #+#             */
/*   Updated: 2023/04/05 21:33:27 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

void	sort_smaller_b(t_variable *var)
{
	int	i;

	i = 0;
	while (var->len_a != 0)
	{
		if (var->a[0] == var->min)
		{
			i++;
			pb(var);
			get_min(var);
		}
		ra(var);
	}
}

void	get_lower_min(t_variable *var)
{
	int	i;

	i = 0;
	var->lower_min = var->max;
	while (i < var->mid_len)
	{
		if (var->a[i] < var->lower_min)
			var->lower_min = var->a[i];
		i++;
	}
}

void	get_upper_min(t_variable *var)
{
	int	i;

	i = var->mid_len;
	var->upper_min = var->max;
	while (i < var->len_a)
	{
		if (var->a[i] < var->upper_min)
			var->upper_min = var->a[i];
		i++;
	}
}

void	refresh_get(t_variable *var)
{
	var->mid_len = var->len_a / 2;
	get_min(var);
	get_max(var);
	get_min_2(var);
	get_upper_min(var);
	get_lower_min(var);
}
