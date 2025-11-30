/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   megaphone.cpp                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/20 11:47:39 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/20 11:47:39 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <iostream>
#include <string>

int main(int argc, char **argv)
{
    if (argc > 1)
	{
        for (int i = 1; i < argc; ++i) 
		{
            std::string arg = argv[i];
            for (size_t j = 0; j < arg.length(); ++j)
                std::cout << (char)std::toupper(arg[j]);
            if (i < argc - 1)
                std::cout << " ";
        }
        std::cout << std::endl;
    }
	else
        std::cout << "* LOUD AND UNBEARABLE FEEDBACK NOISE *" << std::endl;
    return (0);
}
