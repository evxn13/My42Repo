/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   WrongAnimal.cpp                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 20:56:16 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/10 22:09:37 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "WrongAnimal.hpp"

WrongAnimal::WrongAnimal(void) {
    std::cout << "WrongAnimal constructor called" << std::endl;
    this->_type = "WrongAnimal";
}

WrongAnimal::~WrongAnimal(void) {std::cout << "WrongAnimal destructor called" << std::endl;}

WrongAnimal::WrongAnimal(WrongAnimal &src)
{
    std::cout << "WrongAnimal copy constructor called" << std::endl;
    this->_type = src.getType();
}

WrongAnimal &WrongAnimal::operator=(WrongAnimal const &src)
{
    this->_type = src.getType();
    return *this;
}

void WrongAnimal::makeSound(void) const
{
    std::cout << "WrongAnimal sound" << std::endl;
}

std::string WrongAnimal::getType(void) const
{
    return this->_type;
}
