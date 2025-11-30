/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   philo.h                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/03 13:46:47 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/03 13:46:47 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PHILO_H
# define PHILO_H

# include <pthread.h>
# include <stdbool.h>
# include <unistd.h>
# include <sys/time.h>
# include <stdint.h>
# include <stdlib.h>
# include <stdio.h>
# include <string.h>

typedef struct s_philo {
	int				id;
	pthread_mutex_t	*left_fork;
	pthread_mutex_t	*right_fork;
	int				last_meal_time;
	int				meals_eaten;
	struct s_data	*data;
}				t_philo;

typedef struct s_data {
	int				nb_philos;
	int				time_to_die;
	int				time_to_eat;
	int				time_to_sleep;
	int				max_meals;
	pthread_mutex_t	*forks;
	pthread_mutex_t	*speak;
	t_philo			*philos;
	pthread_t		*threads;
	pthread_mutex_t	print_mutex;
	int				start_time;
	pthread_mutex_t	death_mutex;
	pthread_mutex_t	meal1;
	pthread_mutex_t	meal2;
	pthread_mutex_t	meal3;
	int				meals_finish;
	int				philo_died;	
}				t_data;

int		parse_args(int argc, char **argv, t_data *data);
void	*philo_routine(void *philo_ptr);
int		eat(t_philo *philo);
int		think(t_philo *philo);
int		sleep_philo(t_philo *philo);
int		get_current_time(void);
void	take_fork(pthread_mutex_t *fork, t_philo *philo);
void	drop_fork(pthread_mutex_t *fork);
int		init_data(t_data *data);
int		init_forks(t_data *data);
int		init_philos(t_data *data);
void	ft_usleep(int duration);
int		init_threads(t_data *data);
void	display_action(t_philo *philo, char *action);
int		check_arg(int argc, char **argv, t_data *data);
void	forked(t_philo *philo);
void	single_philo(t_data *data, pthread_t *monitor_threads);
void	free_resources(t_data *data);
void	join_threads(t_data *data, pthread_t *monitor_threads);
void	create_threads(t_data *data, pthread_t *monitor_threads);
void	*monitor_routine(void *arg);

#endif // PHILO_H
