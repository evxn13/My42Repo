/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils2.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/07 19:33:38 by marvin            #+#    #+#             */
/*   Updated: 2023/11/07 19:33:38 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cube3d.h"

size_t	ft_split_len(char *s, char c)
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

size_t	ft_number_word(char *str, char c)
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

char	**ft_split(char *s, char c)
{
	size_t	i;
	size_t	j;
	size_t	t;
	char	**n;

	i = 0;
	t = 0;
	n = (char **)malloc(sizeof(char *) * (ft_number_word(s, c) + 1));
	if (!n)
		ft_error("Malloc error", NULL);
	while (i < ft_number_word(s, c))
	{
		n[i] = (char *) malloc(sizeof(char) * (ft_split_len(&s[t], c) + 1));
		if (!n[i])
			ft_error("Malloc error", NULL);
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

char	**ft_strsjoin(char **strs, char *str)
{
	int		i;
	char	**new_strs;

	i = 0;
	new_strs = malloc(sizeof(char *) * (ft_strslen(strs) + 2));
	if (!new_strs)
	{
		free(strs);
		ft_error("Malloc error", NULL);
	}
	while (strs[i])
	{
		new_strs[i] = strs[i];
		i++;
	}
	new_strs[i] = str;
	new_strs[i + 1] = NULL;
	free(strs);
	return (new_strs);
}

char	*ft_strtrim(char *s1, const char *set)
{
	char	*str;
	size_t	start;
	size_t	stop;

	if (!s1 || !set)
		return (NULL);
	start = 0;
	stop = ft_strlen(s1);
	while (s1[start] && ft_is_set(s1[start], set))
		start++;
	while (stop > start && ft_is_set(s1[stop - 1], set))
		stop--;
	str = ft_substr(&s1[start], 0, stop - start);
	return (str);
}
