/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ClapTrap.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/06 22:14:37 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/06 22:14:39 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ClapTrap.hpp"

ClapTrap::ClapTrap(std::string name) : name(name), hitPoints(10), energyPoints(10), attackDamage(0) {
    std::cout << "ClapTrap " << this->name << " is constructed." << std::endl;
}

ClapTrap::~ClapTrap() {
    std::cout << "ClapTrap " << this->name << " is destructed." << std::endl;
}

void ClapTrap::attack(const std::string& target) {
    if (energyPoints > 0 && hitPoints > 0) {
        std::cout << "ClapTrap " << name << " attacks " << target << ", causing "
                  << attackDamage << " points of damage!" << std::endl;
        energyPoints--;
    }
}

void ClapTrap::takeDamage(unsigned int amount) {
    if (hitPoints > 0) {
        std::cout << "ClapTrap " << name << " takes " << amount << " points of damage!" << std::endl;
        hitPoints = (amount > hitPoints) ? 0 : (hitPoints - amount);
    }
}

void ClapTrap::beRepaired(unsigned int amount) {
    if (energyPoints > 0 && hitPoints > 0) {
        std::cout << "ClapTrap " << name << " repairs itself, recovering "
                  << amount << " hit points!" << std::endl;
        hitPoints += amount;
        energyPoints--;
    }
}
