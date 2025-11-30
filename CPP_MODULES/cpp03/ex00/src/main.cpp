/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evan <evan@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/06 21:28:30 by evan              #+#    #+#             */
/*   Updated: 2023/12/06 21:39:16 by evan             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ClapTrap.hpp"

int main(void)
{
    ClapTrap clap("ClapTrap le bg");

    clap.attack("target ");
    clap.takeDamage(5);
    clap.beRepaired(3);
    return (0);
}