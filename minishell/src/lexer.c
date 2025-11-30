/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lexer.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: rheyer <rheyer@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/05/10 23:18:06 by evscheid          #+#    #+#             */
/*   Updated: 2023/07/09 18:51:08 by rheyer           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	add_token(t_token **tokens, char *value, t_token_type type)
{
	t_token	*new_token;
	t_token	*tmp;

	new_token = (t_token *)malloc(sizeof(t_token));
	new_token->value = value;
	new_token->type = type;
	new_token->next = NULL;
	if (*tokens == NULL)
		*tokens = new_token;
	else
	{
		tmp = *tokens;
		while (tmp->next)
			tmp = tmp->next;
		tmp->next = new_token;
	}
}

void	add_separator_token(t_token **tokens, char *input, int *i)
{
	t_token_type	type;
	int				size;

	type = 0;
	size = 1;
	if (input[*i] == '|' && input[*i - 1] && input[*i - 1] != '>')
		type = PIPE;
	else if (input[*i] == '<' && input[*i + 1] && input[*i + 1] == '<')
	{
		type = REDIRECTOR_DOUBLE_IN;
		size = 2;
		*i = *i + 1;
	}
	else if (input[*i] == '<')
		type = REDIRECTOR_IN;
	else if (input[*i] == '>' && input[*i + 1] && input[*i + 1] == '>')
	{
		type = REDIRECTOR_DOUBLE_OUT;
		size = 2;
		*i = *i + 1;
	}
	else if (input[*i] == '>')
		type = REDIRECTOR_OUT;
	if (type)
		add_token(tokens, ft_strndup(input + *i - (size - 1), size), type);
}

void	lexer_part2(char *in, t_lexer_state *state)
{
	if (!state->in_single_quote && !state->in_double_quote
		&& (ft_is_separator(in[state->i]) || ft_isspace(in[state->i])))
	{
		if (state->i > state->start)
			add_token(state->tokens, ft_strndup
				(in + state->start, state->i - state->start), WORD);
		if (ft_is_separator(in[state->i]))
			add_separator_token(state->tokens, in, &(state->i));
		state->start = state->i + 1;
	}
}

t_lexer_state	lexer_state_init(void)
{
	t_lexer_state	state;

	state.i = 0;
	state.start = 0;
	state.in_single_quote = false;
	state.in_double_quote = false;
	state.tokens = NULL;
	return (state);
}

t_token	*lexer(char *input)
{
	t_lexer_state	state;
	t_token			*tokens;

	state = lexer_state_init();
	state.tokens = (t_token **)malloc(sizeof(t_token *));
	*(state.tokens) = NULL;
	while (input[state.i])
	{
		if (input[state.i] == '\'' && !state.in_double_quote)
			state.in_single_quote = !state.in_single_quote;
		else if (input[state.i] == '\"' && !state.in_single_quote)
			state.in_double_quote = !state.in_double_quote;
		lexer_part2(input, &state);
		state.i++;
	}
	if (state.i > state.start)
		add_token(state.tokens, ft_strndup
			(input + state.start, state.i - state.start), WORD);
	tokens = *(state.tokens);
	free(state.tokens);
	return (tokens);
}
