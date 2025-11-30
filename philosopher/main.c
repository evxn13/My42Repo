/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 21:57:47 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/02 21:57:47 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

int	check_death(t_philo *philo)
{
	int	current_time;

	current_time = get_current_time();
	pthread_mutex_lock(&philo->data->death_mutex);
	if (philo->data->philo_died >= 1)
	{
		pthread_mutex_unlock(&philo->data->death_mutex);
		return (1);
	}
	pthread_mutex_unlock(&philo->data->death_mutex);
	pthread_mutex_lock(&philo->data->meal1);
	if ((current_time - philo->last_meal_time) > philo->data->time_to_die)
	{
		pthread_mutex_lock(&philo->data->death_mutex);
		philo->data->philo_died++;
		pthread_mutex_unlock(&philo->data->death_mutex);
		pthread_mutex_unlock(&philo->data->meal1);
		return (1);
	}
	pthread_mutex_unlock(&philo->data->meal1);
	return (0);
}

void	display_died(t_philo *philo)
{
	int			timestamp;
	const char	*color_code;

	color_code = "\033[1;31m";
	timestamp = get_current_time() - philo->data->start_time;
	pthread_mutex_lock(&philo->data->death_mutex);
	pthread_mutex_lock(&philo->data->print_mutex);
	if (philo->data->philo_died == 1)
	{
		philo->data->philo_died++;
		printf("%s[%d] %d %s\033[0m\n",
			color_code, timestamp, philo->id, "died");
		pthread_mutex_unlock(&philo->data->death_mutex);
		pthread_mutex_unlock(&philo->data->print_mutex);
		return ;
	}
	pthread_mutex_unlock(&philo->data->print_mutex);
	pthread_mutex_unlock(&philo->data->death_mutex);
}

void	*monitor_routine(void *arg)
{
	t_philo	*philo;

	philo = (t_philo *)arg;
	while (1)
	{
		pthread_mutex_lock(&philo->data->death_mutex);
		if (philo->data->philo_died >= 1)
		{
			pthread_mutex_unlock(&philo->data->death_mutex);
			return (NULL);
		}
		pthread_mutex_unlock(&philo->data->death_mutex);
		if (check_death(philo))
		{
			pthread_mutex_lock(&philo->data->meal3);
			if (philo->data->meals_finish == 0)
				display_died(philo);
			pthread_mutex_unlock(&philo->data->meal3);
			return (NULL);
		}
		ft_usleep(100);
	}
	return (NULL);
}

void	free_resources(t_data *data)
{
	int	i;

	i = 0;
	free(data->forks);
	free(data->philos);
	free(data->threads);
	while (i < data->nb_philos)
	{
		pthread_mutex_destroy(&data->forks[i]);
		i++;
	}
	pthread_mutex_destroy(&data->death_mutex);
	pthread_mutex_destroy(&data->meal1);
	pthread_mutex_destroy(&data->meal2);
	pthread_mutex_destroy(&data->print_mutex);
}

int	main(int argc, char **argv)
{
	t_data		data;
	pthread_t	*monitor_threads;

	if (check_arg(argc, argv, &data))
		return (1);
	data.start_time = get_current_time();
	monitor_threads = malloc(sizeof(pthread_t) * data.nb_philos);
	if (data.nb_philos == 1)
	{
		single_philo(&data, monitor_threads);
		return (1);
	}
	create_threads(&data, monitor_threads);
	join_threads(&data, monitor_threads);
	free(monitor_threads);
	free_resources(&data);
	return (0);
}
