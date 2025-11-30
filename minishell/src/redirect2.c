/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   redirect2.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/09/26 13:36:05 by evscheid          #+#    #+#             */
/*   Updated: 2023/09/26 13:36:05 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	handle_dup2(int input, int output, t_token *tokens)
{
	if (!ft_is_input(tokens) && dup2(input, STDIN_FILENO) == -1)
	{
		perror("dup2 failed");
		return ;
	}
	if (!ft_is_output(tokens) && ft_is_pipe(tokens)
		&& dup2(output, STDOUT_FILENO) == -1)
	{
		perror("dup2 failed");
		return ;
	}
}

void	handle_redirections(t_token *tokens, int *fd_in, int *fd_out)
{
	while (tokens->next && tokens->type != PIPE)
	{
		if (tokens->type == REDIRECTOR_OUT)
			*fd_out = ft_redirect_out_2(tokens, *fd_out);
		if (tokens->type == REDIRECTOR_DOUBLE_OUT)
			*fd_out = ft_redirect_double_out_2(tokens, *fd_out);
		if (tokens->type == REDIRECTOR_IN)
			*fd_in = ft_redirect_in_2(tokens, *fd_in);
		if (tokens->type == REDIRECTOR_DOUBLE_IN)
			*fd_in = ft_redirect_double_in_2(tokens, *fd_in);
		tokens = tokens->next;
	}
}

void	ft_redirect_2(t_token *tokens, int output, int input)
{
	int		fd_out;
	int		fd_in;
	t_token	*first;

	fd_out = 0;
	fd_in = 0;
	first = tokens;
	while (tokens)
	{
		if (ft_is_builtin(tokens) == 2)
			return ;
		tokens = tokens->next;
	}
	tokens = first;
	handle_dup2(input, output, tokens);
	if (ft_is_input(tokens) || ft_is_output(tokens))
	{
		handle_redirections(tokens, &fd_in, &fd_out);
		ft_redirect_bis_2(input, output, fd_in, fd_out);
	}
}

void	ft_redirect_bis_2(int input, int output, int fd_in, int fd_out)
{
	if (fd_out)
	{
		if (dup2(fd_out, STDOUT_FILENO) == -1)
		{
			perror("dup2 failed");
			return ;
		}
		close(fd_out);
	}
	if (fd_in)
	{
		if (dup2(fd_in, STDIN_FILENO) == -1)
		{
			perror("dup2 failed");
			return ;
		}
		close(fd_in);
	}
	close(input);
	close(output);
}
