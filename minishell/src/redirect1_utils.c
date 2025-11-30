/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   redirect1_utils.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/17 17:26:38 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/17 17:26:38 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	ft_redirect_out_1(t_token *tokens, int fd_out)
{
	if (fd_out)
		close(fd_out);
	fd_out = open(ft_remove_quotes(tokens->next->value),
			O_WRONLY | O_CREAT | O_TRUNC, 0644);
	if (fd_out == -1)
	{
		perror("open failed");
		exit(EXIT_FAILURE);
	}
	return (fd_out);
}

int	ft_redirect_double_out_1(t_token *tokens, int fd_out)
{
	if (fd_out)
		close(fd_out);
	fd_out = open(ft_remove_quotes(tokens->next->value),
			O_WRONLY | O_CREAT | O_APPEND, 0644);
	if (fd_out == -1)
	{
		perror("open failed");
		exit(EXIT_FAILURE);
	}
	return (fd_out);
}

int	ft_redirect_in_1(t_token *tokens, int fd_in)
{
	if (fd_in)
		close(fd_in);
	fd_in = open(ft_remove_quotes(tokens->next->value), O_RDONLY);
	if (fd_in == -1)
	{
		perror("open failed");
		exit(EXIT_FAILURE);
	}
	return (fd_in);
}

int	ft_redirect_double_in_1(t_token *tokens, int fd_in)
{
	char	*str;
	char	*tmp;

	str = ft_strdup("");
	while (1)
	{
		tmp = readline(">");
		if (!ft_strcmp(tokens->next->value, tmp))
		{
			free(tmp);
			break ;
		}
		else
			str = ft_strjoin(str, tmp);
		str = ft_strjoin(str, "\n");
		free(tmp);
	}
	fd_in = open("touche_pas_mon_heredoc_sinon_je_fais_une_depression",
			O_WRONLY | O_CREAT | O_TRUNC, 0644);
	ft_putstr_fd(str, fd_in);
	close(fd_in);
	fd_in = open("touche_pas_mon_heredoc_sinon_je_fais_une_depression",
			O_RDONLY);
	return (fd_in);
}
