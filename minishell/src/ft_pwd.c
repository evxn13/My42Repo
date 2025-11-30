/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_pwd.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: rheyer <rheyer@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/05/14 17:01:26 by evscheid          #+#    #+#             */
/*   Updated: 2023/07/06 22:44:44 by rheyer           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*ft_pwd(void)
{
	char	*buffer;
	size_t	size;

	buffer = NULL;
	size = 1024;
	buffer = malloc(size);
	if (!buffer)
	{
		perror("malloc error");
		exit(EXIT_FAILURE);
	}
	if (getcwd(buffer, size) == NULL)
	{
		perror("getcwd error");
		exit(EXIT_FAILURE);
	}
	printf("%s\n", buffer);
	free(buffer);
	return (buffer);
}
