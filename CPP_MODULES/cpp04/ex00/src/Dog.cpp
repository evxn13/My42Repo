/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Dog.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 16:49:38 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/10 20:53:59 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Dog.hpp"

Dog::Dog(void) {
    std::cout << "Dog constructor called" << std::endl;
    this->_type = "Dog";
}

Dog::~Dog(void)
{
    std::cout << "Dog destructor called" << std::endl;
}

Dog::Dog(Dog &src) : Animal(src)
{
    std::cout << "Dog copy constructor called" << std::endl;
    this->_type = src.getType();
}

Dog &Dog::operator=(Dog const &src)
{
    this->_type = src.getType();
    return *this;
}

void Dog::makeSound(void) const
{
    std::cout << "WOOOOOOOOOOOOUF WOUF" << std::endl;
}

std::string Dog::getType(void) const
{
    return this->_type;
}