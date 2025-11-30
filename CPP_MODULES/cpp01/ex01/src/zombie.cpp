/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   zombie.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/20 17:33:06 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/20 17:33:06 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "zombie.hpp"

Zombie::Zombie() : name("\033[31mUnnamed Zombie\033[0m") {
    std::cout << name << ": A zombie is born" << std::endl;
}

Zombie::Zombie(std::string name) : name(name) {
}

void Zombie::announce() const {
    std::cout << name << ": BraiiiiiiinnnzzzZ..." << std::endl;
}

Zombie::~Zombie() {
    std::cout << name << ": is destroyed" << std::endl;
}

void Zombie::set_name(std::string name) {
    this->name = name;
}
