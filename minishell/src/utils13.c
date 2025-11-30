/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils13.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/30 21:41:33 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/30 21:41:33 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	skip_whitespace(char *str, int i)
{
	while (str[i] == '\t' || str[i] == '\n' || str[i] == '\v'
		|| str[i] == '\f' || str[i] == '\r' || str[i] == ' ')
		i++;
	return (i);
}

void	print_exit_overflow(t_token *tokens)
{
	ft_putstr_fd("exit: ", 2);
	ft_putstr_fd(tokens->next->value, 2);
	ft_putstr_fd("numeric argument required\n", 2);
}

void	print_error_too_many_args(void)
{
	ft_putstr_fd("exit: too many arguments\n", 2);
}

void	print_no_such_file_or_directory(t_token *tokens)
{
	ft_putstr_fd(tokens->value, 2);
	ft_putstr_fd(": No such file or directory\n", 2);
}

void	print_command_not_found(t_token *tokens)
{
	ft_putstr_fd(tokens->value, 2);
	ft_putstr_fd(": command not found\n", 2);
}
