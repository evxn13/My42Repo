/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_substr.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/15 22:36:33 by evscheid          #+#    #+#             */
/*   Updated: 2022/11/17 17:58:46 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"
// #include "ft_strlen.c"

char	*ft_substr(char const *s, unsigned int start, size_t len)
{
	char		*str;
	size_t		i;

	i = 0;
	if (len > ft_strlen(s))
		len = (ft_strlen(s) - start);
	if (start > ft_strlen(s))
		len = 0;
	if (!s)
		return (0);
	str = malloc(sizeof(char) * (len) + 1);
	if (!str)
		return (0);
	while (i < len)
	{
		str[i] = s[start + i];
		i++;
	}
	str[i] = '\0';
	return (str);
}

// int main(void)
// {
// 	char			*s = "hello world";
// 	printf("%s\n", ft_substr(s, 5, 12));
// }