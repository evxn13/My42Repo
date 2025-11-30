/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   FragTrap.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/06 22:14:54 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/06 22:14:55 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "FragTrap.hpp"

FragTrap::FragTrap(std::string name) : ClapTrap(name) {
    this->hitPoints = 100;
    this->energyPoints = 100;
    this->attackDamage = 30;

    std::cout << "FragTrap " << this->name << " is constructed." << std::endl;
}

FragTrap::~FragTrap() {
    std::cout << "FragTrap " << this->name << " is destructed." << std::endl;
}

void FragTrap::attack(const std::string& target) {
    if (energyPoints > 0 && hitPoints > 0) {
        std::cout << "FragTrap " << name << " attacks " << target << ", causing "
                  << attackDamage << " points of damage!" << std::endl;
        energyPoints--;
    }
}

void FragTrap::highFivesGuys(void) {
    std::cout << "FragTrap " << name << " requests a high five!" << std::endl;
}
