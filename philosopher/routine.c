/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   routine.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 19:37:25 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/02 19:37:25 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

void	single_philo(t_data *data, pthread_t *monitor_threads)
{
	const char	*color_thinking;
	const char	*c_fork;
	const char	*color_dead;
	const char	*c_rst;

	color_thinking = "\033[1;34m";
	c_fork = "\033[1;35m";
	color_dead = "\033[1;31m";
	c_rst = "\033[0m";
	pthread_mutex_lock(&data->death_mutex);
	printf("%s[0] 1 is thinking%s\n", color_thinking, c_rst);
	printf("%s[%d] 1 has taken a fork%s\n", c_fork, data->time_to_die, c_rst);
	ft_usleep(data->time_to_die);
	printf("%s[%d] 1 is dead%s\n", color_dead, data->time_to_die, c_rst);
	pthread_mutex_unlock(&data->death_mutex);
	free(monitor_threads);
	free_resources(data);
}

void	*philo_routine(void *philo_ptr)
{
	t_philo	*philo;

	philo = (t_philo *)philo_ptr;
	while (1)
	{
		if (think(philo))
			break ;
		else if (eat(philo))
			break ;
		else if (sleep_philo(philo))
			break ;
		pthread_mutex_lock(&philo->data->meal2);
		if (philo->data->max_meals != -1
			&& philo->meals_eaten >= philo->data->max_meals)
		{
			pthread_mutex_lock(&philo->data->meal3);
			philo->data->meals_finish = 1;
			pthread_mutex_unlock(&philo->data->meal3);
			pthread_mutex_unlock(&philo->data->meal2);
			break ;
		}
		pthread_mutex_unlock(&philo->data->meal2);
	}
	return (NULL);
}
