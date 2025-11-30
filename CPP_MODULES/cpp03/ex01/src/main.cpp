/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evan <evan@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/06 21:52:57 by evan              #+#    #+#             */
/*   Updated: 2023/12/06 21:55:55 by evan             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ClapTrap.hpp"
#include "ScavTrap.hpp"

int main() {
    ClapTrap claptrap("CLAP-TRAP");
    ScavTrap scavtrap("SCAV-TRAP");

    claptrap.attack("Enemy");
    scavtrap.attack("Intru");

    scavtrap.guardGate();

    return 0;
}
