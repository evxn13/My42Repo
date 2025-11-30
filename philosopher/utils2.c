/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils2.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/03 19:58:41 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/03 19:58:41 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

void	join_threads(t_data *data, pthread_t *monitor_threads)
{
	int	i;

	i = -1;
	while (++i < data->nb_philos)
	{
		pthread_join(data->threads[i], NULL);
		pthread_join(monitor_threads[i], NULL);
	}
}

void	create_threads(t_data *data, pthread_t *monitor_threads)
{
	int	i;

	i = -1;
	while (++i < data->nb_philos)
	{
		pthread_create(&data->threads[i], NULL,
			philo_routine, &data->philos[i]);
		pthread_create(&monitor_threads[i], NULL,
			monitor_routine, &data->philos[i]);
	}
}
