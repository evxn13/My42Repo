/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_split.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/11 19:25:42 by evscheid          #+#    #+#             */
/*   Updated: 2022/12/05 00:17:20 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

size_t	ft_split_len(const char *s, char c)
{
	unsigned int	i;
	size_t			ln;

	i = 0;
	ln = 0;
	while (s[i] == c)
		i++;
	while (s[i] != c && s[i++])
		ln++;
	return (ln);
}

size_t	ft_number_word(const char *str, char c)
{
	unsigned int	i;
	size_t			t;

	i = 0;
	t = 0;
	while (str[i])
	{
		if (str[i] != c)
			t++;
		while (str[i] != c && str[i + 1])
			i++;
		i++;
	}
	return (t);
}

char	**ft_split(char const *s, char c)
{
	size_t	i;
	size_t	j;
	size_t	t;
	char	**n;

	i = 0;
	t = 0;
	n = (char **)malloc(sizeof(char *) * (ft_number_word(s, c) + 1));
	if (!n)
		return (0);
	while (i < ft_number_word(s, c))
	{
		n[i] = (char *) malloc(sizeof(char) * (ft_split_len(&s[t], c) + 1));
		if (!n[i])
			return (0);
		j = 0;
		while (s[t] == c)
			t++;
		while (s[t] != c && s[t])
			n[i][j++] = s[t++];
		n[i][j] = '\0';
		i++;
	}
	n[i] = NULL;
	return (n);
}

// int main(void)
// {
// 	char	**tab;
// 	char	c = '-';

// 	tab = ft_split("bonjour-je-m'appelle-evan", c);

// 	int i = 0;
// 	while (tab[i])
// 	{
// 		printf("%s\n", tab[i]);
// 		i++;
// 	}
// }