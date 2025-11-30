/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   minishell.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/09/26 14:42:07 by evscheid          #+#    #+#             */
/*   Updated: 2023/09/26 14:42:07 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../src/minishell.h"

int	error_expander(char *input, t_env *env)
{
	if (!ft_strcmp(input, "$?"))
	{
		ft_putnbr(env->exit_code);
		ft_putstr_fd(": command not found\n", 2);
		env->exit_code = 127;
		return (1);
	}
	return (0);
}

int	input_check_is_heredoc(char *input)
{
	int	i;

	i = -1;
	while (input[++i])
	{
		if (input[i] == '<' && input[i + 1] == '<')
			return (1);
	}
	return (0);
}

char	*ft_minishell_1(t_env *env, char *input)
{
	char	*prompt;

	prompt = create_prompt(env);
	input = readline(prompt);
	free(prompt);
	return (input);
}

char	*ft_minishell_parse(t_env *env, char *input)
{
	if (!input)
	{
		ft_putstr_fd("exit\n", STDOUT_FILENO);
		exit(env->exit_code);
	}
	if (!input_check_is_heredoc(input))
		add_history(input);
	if (ft_strcmp(env->value, "echo"))
		input = parse_input(input);
	else
		input = parser(parse_input(input));
	return (input);
}

void	ft_minishell(t_token *tokens, t_env *env)
{
	char	*input;
	int		fd_in_saved;
	int		fd_out_saved;

	env->exit_code = 0;
	fd_in_saved = dup(STDIN_FILENO);
	fd_out_saved = dup(STDOUT_FILENO);
	while (42)
	{
		input = ft_minishell_1(env, input);
		input = ft_minishell_parse(env, input);
		if (error_dollar(input, env))
			continue ;
		if (error_expander(input, env))
			continue ;
		handle_input(&tokens, &env, input);
		execute_commands(tokens, env, fd_in_saved, fd_out_saved);
		free(input);
	}
}
