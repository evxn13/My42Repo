/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   client.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/01/13 17:37:37 by evscheid          #+#    #+#             */
/*   Updated: 2023/03/02 02:02:24 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minitalk.h"

void	handle_signal(int signal)
{
	if (signal == SIGUSR2)
	{
		ft_printf("Signals intercepted.\n");
		exit(0);
	}
}

void	kill_client(int pid_server, char c)
{
	int	bytes_w;

	bytes_w = 128;
	while (bytes_w)
	{
		kill(pid_server, SIGUSR1 + (c & bytes_w) / bytes_w);
		bytes_w >>= 1;
		pause();
	}
}

int	main(int argc, char **argv)
{
	int					pid_server;
	struct sigaction	sa;

	if (argc < 3)
	{
		ft_printf("Usage: %s <server_pid_> <message> \n", argv[0]);
		return (1);
	}
	sa.sa_handler = handle_signal;
	sigaction(SIGUSR1, &sa, NULL);
	sigaction(SIGUSR2, &sa, NULL);
	pid_server = ft_atoi(argv[1]);
	while (*argv[2])
	{
		kill_client(pid_server, *argv[2]);
		argv[2]++;
	}
	kill_client(pid_server, 0);
	return (0);
}
