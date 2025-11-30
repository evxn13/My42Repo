/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Animal.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 16:29:21 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/11 11:35:56 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Animal.hpp"

Animal::Animal(void)
{
    std::cout << "Animal constructor called" << std::endl;
    this->_type = "Animal";
}

Animal::Animal(Animal const &src)
{
    std::cout << "Animal constructor from a copy" << std::endl;
    this->_type = src.getType();
}

Animal::~Animal(void) {std::cout << "Animal destructor called" << std::endl;}

std::string Animal::getType(void) const {return this->_type;}

void Animal::makeSound(void) const {std::cout << "Original Animal sound (MEOW, WOUF, WOAF, PIOU PIOU)" << std::endl;}

Animal &Animal::operator=(Animal const &src)
{
    this->_type = src.getType();
    return *this;
}
