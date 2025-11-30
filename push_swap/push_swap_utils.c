/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   push_swap_utils.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/30 15:08:37 by evscheid          #+#    #+#             */
/*   Updated: 2023/04/05 20:30:37 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

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

void	get_min(t_variable *var)
{
	int	i;

	i = 0;
	var->min = var->max;
	while (i < var->len_a)
	{
		if (var->a[i] < var->min)
			var->min = var->a[i];
		i++;
	}
}

void	get_min_2(t_variable *var)
{
	int	i;

	i = 0;
	var->min2 = var->max;
	while (i < var->len_a)
	{
		if (var->a[i] < var->min2 && var->a[i] != var->min)
			var->min2 = var->a[i];
		i++;
	}
}

void	get_max(t_variable *var)
{
	int	i;

	i = 0;
	var->max = var->a[0];
	while (i < var->len_a)
	{
		if (var->a[i] > var->max)
			var->max = var->a[i];
		i++;
	}
}

void	*ft_memmove(int *destination, int *source, size_t size)
{
	int		*dest;
	int		*src;
	size_t	i;

	i = 0;
	dest = destination;
	src = source;
	if ((!destination && !source))
		return (NULL);
	if (size == 0)
		return (dest);
	if (source < destination)
	{
		while (size-- > 0)
			dest[size] = src[size];
	}
	else
	{
		while (size > i)
		{
			dest[i] = src[i];
			i++;
		}
	}
	return (dest);
}
