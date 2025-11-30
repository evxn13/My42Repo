/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   push_swap.h                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/01 01:11:08 by evscheid          #+#    #+#             */
/*   Updated: 2023/05/14 20:23:03 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PUSH_SWAP_H
# define PUSH_SWAP_H

# include <stdio.h>
# include <stdlib.h>
# include <limits.h>
# include "ft_printf/ft_printf.h"

typedef struct s_variable
{
	int	*a;
	int	*b;
	int	len_a;
	int	len_b;
	int	max;
	int	max_bit;
	int	*tab_index;
	int	len_ab;
	int	min;
	int	min2;
	int	mid_len;
	int	lower_min;
	int	upper_min;
	int	target;
}				t_variable;

void	small_sort(t_variable *var);
void	push_swap(t_variable *var);
int		*get_len(int argc, t_variable *var);
int		*print_b(t_variable *var);
int		*print_a(t_variable *var);
int		*put_in_a(char **argv, t_variable *var);
int		ft_atoi(const char *s);
void	easy_sort(t_variable *var);
void	*ft_memmove(int *destination, int *source, size_t size);
void	sa(t_variable *var);
void	ra(t_variable *var);
void	rra(t_variable *var);
void	three_arg(t_variable *var);
void	pb(t_variable *var);
void	pa(t_variable *var);
void	get_max(t_variable *var);
void	get_min(t_variable *var);
void	get_min_2(t_variable *var);
void	small_sort(t_variable *var);
void	sort_to_a(t_variable *var);
void	algo(t_variable *var);
void	radix_sort(t_variable *var);
int		get_max_bit_weight(t_variable *var);
void	format_stack(t_variable *var);
void	ra_mute(t_variable *var);
void	rra_mute(t_variable *var);
void	pb_mute(t_variable *var);
void	refresh_get(t_variable *var);
int		parsing(t_variable *var);
void	check_doublon(t_variable *var);
void	check_int_limits(char *str, t_variable *var, int h);
void	sb(t_variable *var);

#endif
