/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strnstr.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/10 13:08:36 by evscheid          #+#    #+#             */
/*   Updated: 2022/11/13 22:44:35 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strnstr(const char *haystack, const char *needle, size_t len)
{
	size_t	i;
	size_t	j;

	i = 0;
	j = 0;
	if (!*needle)
		return ((char *)haystack);
	while (haystack[i] != '\0' && i < len)
	{
		j = 0;
		if (haystack[i] == needle[0])
		{
			while (needle[j] != '\0' && haystack[i + j] != '\0' && i + j < len)
			{
				if (haystack[i + j] != needle[j])
					break ;
				if (needle[j + 1] == '\0')
					return ((char *)&haystack[i]);
				j++;
			}
		}
		i++;
	}
	return (0);
}

// int	main(void)
// {
// 	char	str[] = "je m'appelle ievan";
// 	char	me[] = "evan";
// 	printf("%s\n", ft_strstr(str, me));
// 	printf("%s\n", str);
// 	printf("%s\n", me);
// }