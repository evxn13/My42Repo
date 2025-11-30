/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parser2.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/09/26 13:57:54 by evscheid          #+#    #+#             */
/*   Updated: 2023/09/26 13:57:54 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*concat_input(char *input, char *additional_input)
{
	char	*new_input;

	new_input = ft_strjoin(input, additional_input);
	free(input);
	free(additional_input);
	return (new_input);
}

void	count_quotes(char *s, int *s_cnt, int *d_cnt)
{
	int	i;

	i = 0;
	while (s[i])
	{
		if (s[i] == '\"')
			(*d_cnt)++;
		else if (s[i] == '\'')
			(*s_cnt)++;
		i++;
	}
}

char	*parse_input(char *input)
{
	int		single_quote_count;
	int		double_quote_count;
	char	*additional_input;
	char	*prompt;

	single_quote_count = 0;
	double_quote_count = 0;
	while (check_unmatched_quotes(input))
	{
		count_quotes(input, &single_quote_count, &double_quote_count);
		if (single_quote_count % 2 != 0)
			prompt = ">";
		else
			prompt = ">";
		additional_input = readline(prompt);
		input = concat_input(input, additional_input);
	}
	if (check_invalid_operators(input))
	{
		free(input);
		return (NULL);
	}
	return (input);
}
