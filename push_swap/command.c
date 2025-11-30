/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   command.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/30 15:22:31 by evscheid          #+#    #+#             */
/*   Updated: 2023/04/05 18:20:26 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

void	sa(t_variable *var)
{
	int	tmp;

	tmp = var->a[0];
	var->a[0] = var->a[1];
	var->a[1] = tmp;
	ft_printf("sa\n");
}

void	ra(t_variable *var)
{
	int	tmp;
	int	i;

	tmp = var->a[0];
	i = 0;
	while (i < var->len_a)
	{
		var->a[i] = var->a[i + 1];
		i++;
	}
	var->a[var->len_a - 1] = tmp;
	ft_printf("ra\n");
}

void	rra(t_variable *var)
{
	int	tmp;
	int	i;

	tmp = var->a[var->len_a - 1];
	i = var->len_a - 1;
	while (i > 0)
	{
		var->a[i] = var->a[i - 1];
		i--;
	}
	var->a[0] = tmp;
	ft_printf("rra\n");
}

void	pb(t_variable *var)
{
	if (var->len_b > 0)
		ft_memmove(var->b + 1, var->b, var->len_b);
	var->b[0] = var->a[0];
	ft_memmove(var->a, var->a + 1, var->len_a);
	var->len_a--;
	var->len_b++;
	ft_printf("pb\n");
}

void	pa(t_variable *var)
{
	if (var->len_a > 0)
		ft_memmove(var->a + 1, var->a, var->len_a);
	var->a[0] = var->b[0];
	ft_memmove(var->b, var->b + 1, var->len_b);
	var->len_b--;
	var->len_a++;
	ft_printf("pa\n");
}
