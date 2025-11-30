/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/27 20:10:15 by evscheid          #+#    #+#             */
/*   Updated: 2023/05/14 20:20:18 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

int	main(int argc, char **argv)
{
	t_variable	var;

	var.a = malloc(sizeof(int *) * argc);
	var.b = malloc(sizeof(int *) * argc);
	put_in_a(argv, &var);
	get_len(argc, &var);
	get_max(&var);
	get_min(&var);
	check_doublon(&var);
	var.len_ab = var.len_a;
	if (parsing(&var) == 1)
		push_swap(&var);
	free(var.a);
	free(var.b);
	return (0);
}
