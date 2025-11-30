/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_echo.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/05/10 02:59:03 by evscheid          #+#    #+#             */
/*   Updated: 2023/05/10 02:59:03 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*get_var_name(char **arg)
{
	char	*start;
	char	*var_name;
	int		len;

	start = *arg;
	len = 0;
	while (isalnum(**arg) || **arg == '_')
	{
		(*arg)++;
		len++;
	}
	var_name = malloc(len + 1);
	if (!var_name)
	{
		perror("malloc failed");
		exit(EXIT_FAILURE);
	}
	ft_strncpy(var_name, start, len);
	var_name[len] = '\0';
	return (var_name);
}

void	handle_dollar(char **arg, t_env *env)
{
	char	*var_name;
	char	*var_value;

	(*arg)++;
	if (is_interagation(*arg, env))
		return ;
	else if (isalnum(**arg) || **arg == '_')
	{
		var_name = get_var_name(arg);
		var_value = get_env_value(env, var_name);
		if (var_value)
		{
			ft_putstr(var_value);
			if (*((*arg) + 1) != '\0')
				ft_putstr(" ");
		}
		free(var_name);
	}
	else
	{
		ft_putstr("$");
		(*arg)--;
	}
}

void	read_file_content(const char *file_path)
{
	FILE	*file;
	char	ch;

	file = fopen(file_path, "r");
	if (file == NULL)
	{
		perror("fopen failed");
		return ;
	}
	while (ch != EOF)
	{
		ch = fgetc(file);
		ft_putchar(ch);
	}
	fclose(file);
}

int	ft_echo_arg(char *arg, t_env *env)
{
	int	quote_type;
	int	double_quote_inside_single;

	double_quote_inside_single = 0;
	quote_type = 0;
	if (is_echo_point_slash(arg))
		return (1);
	while (*arg)
	{
		quote_type = handle_quotes(arg, quote_type);
		if (quote_type == 1 && *arg == '\"')
			double_quote_inside_single = 1;
		if (*arg == '\\' && (*(arg + 1) == '\"' || *(arg + 1) == '\''))
			arg++;
		else if (is_dollar_and_quote(arg, env, quote_type))
			return (1);
		else if (*arg != '\"' && (quote_type == 2 || *arg != '\''))
			write(STDOUT_FILENO, arg, 1);
		else if (quote_type == 1 && double_quote_inside_single && *arg != '\'')
			write(STDOUT_FILENO, arg, 1);
		arg++;
	}
	return (0);
}

void	ft_echo(t_token *args, t_env *env)
{
	int		option_n;
	int		count;
	t_token	*current;

	option_n = 0;
	count = 0;
	current = args->next;
	while (current && is_option_n(current->value))
	{
		option_n = 1;
		current = current->next;
	}
	while (current && current->type != PIPE)
	{
		count = ft_echo_arg(current->value, env);
		if (count == 1)
			return ;
		if (current->next && current->next->type != PIPE)
			ft_putstr(" ");
		current = current->next;
	}
	if (!option_n && count == 0)
		ft_putstr("\n");
}
