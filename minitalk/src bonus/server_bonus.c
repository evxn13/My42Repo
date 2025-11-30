/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server_bonus.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/01/25 17:41:18 by evscheid          #+#    #+#             */
/*   Updated: 2023/03/02 02:16:25 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minitalk_bonus.h"

void	message_handling(int signal, siginfo_t *sa, void *context)
{
	static int	client_pid = 0;
	static int	bytes_w = 128;
	static char	c = '\0';

	(void)context;
	if (sa->si_pid)
		client_pid = sa->si_pid;
	c = c | (bytes_w * (signal - SIGUSR1));
	bytes_w >>= 1;
	if (!bytes_w)
	{
		if (c)
			write(1, &c, 1);
		else
		{
			write(1, "\n", 1);
			kill(client_pid, SIGUSR2);
		}
		c = '\0';
		bytes_w = 128;
	}
	usleep(30);
	kill(client_pid, SIGUSR1);
}

int	main(void)
{
	struct sigaction	sa;

	sa.sa_sigaction = message_handling;
	sa.sa_flags = SA_SIGINFO;
	ft_printf("%d\n", getpid());
	sigaction(SIGUSR1, &sa, NULL);
	sigaction(SIGUSR2, &sa, NULL);
	while (1)
		;
	return (0);
}
