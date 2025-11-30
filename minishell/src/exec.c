/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   exec.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: rheyer <rheyer@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/05/13 20:36:20 by rheyer            #+#    #+#             */
/*   Updated: 2023/07/09 20:23:37 by rheyer           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	child_2(char *cmd, t_token *tokens, t_env *env, char *path_env)
{
	if (access(cmd, X_OK) == 0)
	{
		execve(cmd, token_list_to_char_arr(tokens),
			ft_env_lst_to_char_arr(env));
		free(cmd);
		perror("execve");
		env->exit_code = 1;
		exit(env->exit_code);
	}
	if (!path_env)
	{
		ft_error(tokens->value, "command not found");
		env->exit_code = 127;
		exit(127);
	}
}

void	child(t_token *tokens, t_env *env, int output, int input)
{
	char	**paths;
	char	*path_env;
	char	*cmd;

	cmd = tokens->value;
	if (ft_is_builtin(tokens) != 2)
		ft_redirect_1(tokens, output, input);
	tokens = ft_remove_tokens(tokens);
	path_env = get_env_value(env, "PATH");
	child_2(cmd, tokens, env, path_env);
	path_env = ft_strdup(path_env);
	paths = ft_split(path_env, ':');
	if (ft_is_builtin(tokens))
		ft_builtin(tokens, env);
	else
		exec_child_process(tokens, env, paths);
	free(path_env);
	free_char_arr(paths);
	exit(env->exit_code);
}

void	ft_pipex_2(t_pipex_args *args)
{
	int	status;

	if (args->n > 0)
	{
		while (args->tokens->type != PIPE && args->n > 0)
			args->tokens = args->tokens->next;
		args->tokens = args->tokens->next;
	}
	close(args->pipefd[1]);
	close(args->input);
	if (args->n > 0)
	{
		args->input = dup(args->pipefd[0]);
		close(args->pipefd[0]);
		ft_pipex(args->tokens, args->env, --(args->n), args->input);
	}
	else
		close(args->pipefd[0]);
	waitpid(args->pid, &status, 0);
	args->env->exit_code = extract_exit_code(status);
	unlink("touche_pas_mon_heredoc_sinon_je_fais_une_depression");
}

void	ft_pipex(t_token *tokens, t_env *env, int n, int input)
{
	int				pipefd[2];
	pid_t			pid;
	t_pipex_args	args;

	initialize_pipe(pipefd);
	pid = create_fork();
	if (pid == 0)
	{
		close(pipefd[0]);
		if (n > 0)
			child(tokens, env, pipefd[1], input);
		else
			child(tokens, env, dup(STDOUT_FILENO), input);
		exit (0);
	}
	args.tokens = tokens;
	args.env = env;
	args.n = n;
	args.input = input;
	args.pipefd[0] = pipefd[0];
	args.pipefd[1] = pipefd[1];
	args.pid = pid;
	ft_pipex_2(&args);
}
