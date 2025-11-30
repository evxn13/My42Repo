/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/03 13:46:20 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/03 13:46:20 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

int	init_threads(t_data *data)
{
	data->threads = malloc(sizeof(pthread_t) * data->nb_philos);
	if (!data->threads)
		return (-1);
	return (0);
}

int	init_forks(t_data *data)
{
	int	i;

	data->forks = malloc(sizeof(pthread_mutex_t) * data->nb_philos);
	if (!data->forks)
		return (-1);
	i = 0;
	while (i < data->nb_philos)
	{
		pthread_mutex_init(&data->forks[i], NULL);
		i++;
	}
	return (0);
}

int	init_philos(t_data *data)
{
	int	i;

	data->philos = malloc(sizeof(t_philo) * data->nb_philos);
	if (!data->philos)
		return (-1);
	i = 0;
	while (i < data->nb_philos)
	{
		data->philos[i].id = i + 1;
		data->philos[i].last_meal_time = get_current_time();
		data->philos[i].meals_eaten = 0;
		data->philos[i].data = data;
		data->philos[i].left_fork = &data->forks[i];
		data->philos[i].right_fork = &data->forks[(i + 1) % data->nb_philos];
		i++;
	}
	return (0);
}

int	init_data(t_data *data)
{
	if (init_forks(data) == -1)
		return (-1);
	if (init_philos(data) == -1)
	{
		free(data->forks);
		return (-1);
	}
	if (init_threads(data) == -1)
	{
		free(data->forks);
		free(data->philos);
		return (-1);
	}
	pthread_mutex_init(&data->death_mutex, NULL);
	pthread_mutex_init(&data->meal1, NULL);
	pthread_mutex_init(&data->meal2, NULL);
	pthread_mutex_init(&data->meal3, NULL);
	pthread_mutex_init(&data->print_mutex, NULL);
	data->philo_died = 0;
	data->meals_finish = 0;
	return (0);
}
