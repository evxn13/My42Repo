/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils8.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/19 19:30:38 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/19 19:30:38 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	ft_strtol(const char *str, char **endptr, int base)
{
	int		i;
	int		sign;
	long	result;

	i = 0;
	sign = 1;
	result = 0;
	i = skip_whitespace((char *)str, i);
	if (str[i] == '-')
		sign = -1;
	else if (str[i] == '+')
		sign = 1;
	if (str[i] == '-' || str[i] == '+')
		i++;
	while (str[i] >= '0' && str[i] <= '9')
	{
		result = result * base + (str[i++] - '0');
		if (result > 2147483647 && sign == 1)
			return (-1);
		if (result > 2147483648 && sign == -1)
			return (0);
	}
	*endptr = (char *)&str[i];
	return (result * sign);
}

void	reseption(int signal)
{
	if (signal == SIGINT)
	{
		printf("\n");
		rl_on_new_line();
		rl_replace_line("", 0);
		rl_redisplay();
	}
	else if (signal == SIGQUIT)
	{
		rl_replace_line("", 0);
		rl_redisplay();
	}
}

void	handle_signal(void)
{
	struct sigaction	sa;

	sa.sa_handler = reseption;
	sa.sa_flags = 0;
	sigemptyset(&sa.sa_mask);
	sigaction(SIGINT, &sa, NULL);
	sigaction(SIGQUIT, &sa, NULL);
}

char	*ft_strncpy(char *dest, char *src, unsigned int n)
{
	unsigned int	i;
	unsigned int	len;

	i = 0;
	len = ft_strlen(src);
	while (i < n)
	{
		if (i < len)
			dest[i] = src[i];
		else
			dest[i] = '\0';
		i++;
	}
	return (dest);
}

int	handle_quotes(char *arg, int quote_type)
{
	if (*arg == '\'' && quote_type != 2)
	{
		if (quote_type == 1)
			quote_type = 0;
		else
			quote_type = 1;
	}
	else if (*arg == '\"' && quote_type != 1)
	{
		if (quote_type == 2)
			quote_type = 0;
		else
			quote_type = 2;
	}
	return (quote_type);
}
