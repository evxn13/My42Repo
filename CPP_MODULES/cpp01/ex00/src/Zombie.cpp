/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Zombie.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/20 17:02:07 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/20 17:02:07 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Zombie.hpp"
#include <iostream>

Zombie::Zombie(std::string name) : name(name) {
	std::cout << name << ": created" << std::endl;
}

Zombie::~Zombie() {
    std::cout << name << ": destroyed" << std::endl;
}

void Zombie::announce(void) const {
    std::cout << name << ": BraiiiiiiinnnzzzZ..." << std::endl;
}
