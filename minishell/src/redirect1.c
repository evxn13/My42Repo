/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   redirect.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: rheyer <rheyer@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/07/09 20:21:54 by rheyer            #+#    #+#             */
/*   Updated: 2023/07/09 20:31:27 by rheyer           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	handle_dup2_exit(int input, int output, t_token *tokens)
{
	if (!ft_is_input(tokens) && dup2(input, STDIN_FILENO) == -1)
	{
		perror("dup2 failed");
		exit(EXIT_FAILURE);
	}
	if (!ft_is_output(tokens) && ft_is_pipe(tokens)
		&& dup2(output, STDOUT_FILENO) == -1)
	{
		perror("dup2 failed");
		exit(EXIT_FAILURE);
	}
}

void	handle_redirections_exit(t_token *tokens, int *fd_in, int *fd_out)
{
	while (tokens->next && tokens->type != PIPE)
	{
		if (tokens->type == REDIRECTOR_OUT)
			*fd_out = ft_redirect_out_1(tokens, *fd_out);
		if (tokens->type == REDIRECTOR_DOUBLE_OUT)
			*fd_out = ft_redirect_double_out_1(tokens, *fd_out);
		if (tokens->type == REDIRECTOR_IN)
			*fd_in = ft_redirect_in_1(tokens, *fd_in);
		if (tokens->type == REDIRECTOR_DOUBLE_IN)
			*fd_in = ft_redirect_double_in_1(tokens, *fd_in);
		tokens = tokens->next;
	}
}

void	ft_redirect_1(t_token *tokens, int output, int input)
{
	int	fd_out;
	int	fd_in;

	fd_out = 0;
	fd_in = 0;
	handle_dup2_exit(input, output, tokens);
	handle_redirections_exit(tokens, &fd_in, &fd_out);
	ft_redirect_bis_1(input, output, fd_in, fd_out);
}

void	ft_redirect_bis_1(int input, int output, int fd_in, int fd_out)
{
	if (fd_out)
	{
		if (dup2(fd_out, STDOUT_FILENO) == -1)
		{
			perror("dup2 failed");
			exit(EXIT_FAILURE);
		}
		close(fd_out);
	}
	if (fd_in)
	{
		if (dup2(fd_in, STDIN_FILENO) == -1)
		{
			perror("dup2 failed");
			exit(EXIT_FAILURE);
		}
		close(fd_in);
	}
	close(input);
	close(output);
}
