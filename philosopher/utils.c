/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/03 13:48:05 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/03 13:48:05 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

int	get_current_time(void)
{
	struct timeval	tv;

	gettimeofday(&tv, NULL);
	return (tv.tv_sec * (int)1000 + tv.tv_usec / 1000);
}

void	ft_usleep(int duration)
{
	int	start_time;
	int	end_time;

	start_time = get_current_time();
	end_time = start_time + duration;
	while (get_current_time() < end_time)
		usleep(500);
}

void	lock_fork(pthread_mutex_t *fork)
{
	pthread_mutex_lock(fork);
}

// Déverrouille une fourchette (mutex)
void	unlock_fork(pthread_mutex_t *fork)
{
	pthread_mutex_unlock(fork);
}

void	display_action(t_philo *philo, char *action)
{
	int			time;
	const char	*color_code;

	time = get_current_time() - philo->data->start_time;
	color_code = "\033[0m";
	if (strcmp(action, "is eating") == 0)
		color_code = "\033[1;32m";
	else if (strcmp(action, "is sleeping") == 0)
		color_code = "\033[1;33m";
	else if (strcmp(action, "is thinking") == 0)
		color_code = "\033[1;34m";
	else if (strcmp(action, "has taken a fork") == 0)
		color_code = "\033[1;35m";
	pthread_mutex_lock(&philo->data->death_mutex);
	pthread_mutex_lock(&philo->data->print_mutex);
	if (philo->data->philo_died < 1)
	{
		printf("%s[%d] %d %s\033[0m\n", color_code, time, philo->id, action);
		pthread_mutex_unlock(&philo->data->death_mutex);
		pthread_mutex_unlock(&philo->data->print_mutex);
		return ;
	}
	pthread_mutex_unlock(&philo->data->print_mutex);
	pthread_mutex_unlock(&philo->data->death_mutex);
}
