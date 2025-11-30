/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   AAnimal.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 16:29:21 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/11 11:35:56 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "AAnimal.hpp"

AAnimal::AAnimal(void)
{
    std::cout << "AAnimal constructor called" << std::endl;
    this->_type = "AAnimal";
}

AAnimal::AAnimal(AAnimal const &src)
{
    std::cout << "AAnimal constructor from a copy" << std::endl;
    this->_type = src.getType();
}

AAnimal::~AAnimal(void) {std::cout << "AAnimal destructor called" << std::endl;}

std::string AAnimal::getType(void) const {return this->_type;}

void AAnimal::makeSound(void) const {std::cout << "Original AAnimal sound (MEOW, WOUF, WOAF, PIOU PIOU)" << std::endl;}

AAnimal &AAnimal::operator=(AAnimal const &src)
{
    this->_type = src.getType();
    return *this;
}
