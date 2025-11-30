/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parser.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/09/23 14:44:21 by evscheid          #+#    #+#             */
/*   Updated: 2023/09/23 14:44:21 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	update_state(char c, int *state)
{
	if (c == '\"' && *state != 1)
	{
		if (*state == 2)
			*state = 0;
		else
			*state = 2;
	}
	else if (c == '\'' && *state != 2)
	{
		if (*state == 1)
			*state = 0;
		else
			*state = 1;
	}
}

int	handle_pipe(char *input, int i, int state)
{
	if (state == 0 && input[i] == '|')
	{
		if (i == 0 || !input[i + 1])
			return (1);
	}
	return (0);
}

int	check_invalid_operators(char *input)
{
	int	state;
	int	i;

	state = 0;
	i = 0;
	while (input[i])
	{
		update_state(input[i], &state);
		if (state == 0 && (input[i] == '<' || input[i] == '>'))
		{
			if (handle_redirection_errors(input, i))
				return (1);
		}
		if (handle_pipe(input, i, state))
		{
			print_syntax_error("|");
			return (1);
		}
		i++;
	}
	return (0);
}

char	*get_additional_input(void)
{
	char	*additional_input;

	additional_input = readline(">");
	if (!additional_input)
	{
		printf("exit\n");
		exit(0);
	}
	return (additional_input);
}
