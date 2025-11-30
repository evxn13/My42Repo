/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parse.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/03 13:46:42 by evscheid          #+#    #+#             */
/*   Updated: 2023/10/03 13:46:42 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

int	check_arg(int argc, char **argv, t_data *data)
{
	if (parse_args(argc, argv, data) != 0)
	{
		printf("Erreur : arguments invalides.\n");
		return (1);
	}
	if (init_data(data) != 0)
	{
		printf("Erreur : échec de l'initialisation.\n");
		return (1);
	}
	return (0);
}

static int	ft_atoi(const char *str)
{
	int	result;
	int	sign;

	result = 0;
	sign = 1;
	while (*str && (*str == ' ' || (*str >= '\t' && *str <= '\r')))
		str++;
	if (*str == '-' || *str == '+')
	{
		if (*str == '-')
		{
			sign = -1;
		}
		str++;
	}
	while (*str && *str >= '0' && *str <= '9')
	{
		result = result * 10 + (*str - '0');
		str++;
	}
	return (result * sign);
}

int	parse_is_num(char **argv)
{
	int	i;
	int	j;

	i = 0;
	j = 1;
	while (argv[j])
	{
		i = 0;
		while (argv[j][i])
		{
			if (!(argv[j][i] <= '9' && argv[j][i] >= '0'))
				return (1);
			i++;
		}
		j++;
	}
	return (0);
}

int	parse_args(int argc, char **argv, t_data *data)
{
	if (argc < 5 || argc > 6)
		return (-1);
	if (parse_is_num(argv))
		return (-1);
	data->nb_philos = ft_atoi(argv[1]);
	data->time_to_die = ft_atoi(argv[2]);
	data->time_to_eat = ft_atoi(argv[3]);
	data->time_to_sleep = ft_atoi(argv[4]);
	if (argc == 6)
		data->max_meals = ft_atoi(argv[5]);
	else
		data->max_meals = -1;
	if (data->nb_philos <= 0 || data->time_to_die < 0
		|| data->time_to_eat <= 0 || data->time_to_sleep <= 0
		|| (argc == 6 && data->max_meals <= 0))
		return (-1);
	return (0);
}
