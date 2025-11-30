/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/06 22:15:08 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/06 22:15:08 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ClapTrap.hpp"
#include "ScavTrap.hpp"
#include "FragTrap.hpp"

int main() {
    ClapTrap claptrap("CLAP-TRAP");
    ScavTrap scavtrap("SCAV-TRAP");
    FragTrap fragtrap("FRAG-TRAP");

    claptrap.attack("l'enemi un peu bete");
    scavtrap.attack("l'intru !!!!");
    fragtrap.attack("l'enemi juré");

    scavtrap.guardGate();
    fragtrap.highFivesGuys();

    return 0;
}
