/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   push_swap.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/27 17:11:10 by evscheid          #+#    #+#             */
/*   Updated: 2023/05/14 20:12:22 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

void	push_swap(t_variable *var)
{
	if (var->len_a <= 5)
		small_sort(var);
	else if (var->len_a > 5)
	{
		format_stack(var);
		radix_sort(var);
	}
}

int	is_valid_number(char *str)
{
	int	i;

	if (str == NULL || str[0] == '\0')
		return (0);
	if (str[0] == '-')
		i = 1;
	else
		i = 0;
	while (str[i])
	{
		if (str[i] < '0' || str[i] > '9')
			return (0);
		i++;
	}
	return (1);
}

int	*put_in_a(char **argv, t_variable *var)
{
	int	i;
	int	h;

	i = 1;
	h = 0;
	while (argv[i])
	{
		if (!is_valid_number(argv[i]))
		{
			ft_putstr_fd("Error\n", 2);
			exit(1);
		}
		check_int_limits(argv[i], var, h);
		i++;
		h++;
	}
	return (0);
}

void	check_doublon(t_variable *var)
{
	int	i;
	int	j;

	i = 0;
	while (i < var->len_a)
	{
		j = i + 1;
		while (j < var->len_a)
		{
			if (var->a[i] == var->a[j])
			{
				ft_printf("Error\n");
				exit(1);
			}
			j++;
		}
		i++;
	}
}

int	*get_len(int argc, t_variable *var)
{
	var->len_a = argc - 1;
	var->len_b = 0;
	return (0);
}
