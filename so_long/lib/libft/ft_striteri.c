/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_striteri.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/14 23:01:13 by evscheid          #+#    #+#             */
/*   Updated: 2022/11/15 21:49:06 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	ft_striteri(char *src, void (*f)(unsigned int, char*))
{
	int	i;

	i = -1;
	if (f && src)
		while (src[++i])
			(*f)(i, &src[i]);
}
