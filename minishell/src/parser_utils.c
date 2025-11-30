/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parser_utils.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/17 17:40:35 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/17 17:40:35 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	check_unmatched_quotes(char *input)
{
	int	state;
	int	i;

	state = 0;
	i = 0;
	while (input[i])
	{
		update_state(input[i], &state);
		i++;
	}
	if (state != 0)
	{
		return (1);
	}
	return (0);
}

int	input_end_is_space(char *input)
{
	int	i;

	i = ft_strlen(input) - 1;
	while (input[i] == ' ' || input[i] == '\t')
		i--;
	if (input[i] == '|' || input[i] == '<' || input[i] == '>')
		return (1);
	return (0);
}

void	print_syntax_error(char *token)
{
	printf("minishell: syntax error near unexpected token `%s'\n", token);
}

int	handle_redirection_errors(char *input, int i)
{
	if (i == 0 && input_end_is_space(input))
	{
		print_syntax_error("newline");
		return (1);
	}
	else if (!input[i + 1] || input_end_is_space(input))
	{
		print_syntax_error("newline");
		return (1);
	}
	return (0);
}
