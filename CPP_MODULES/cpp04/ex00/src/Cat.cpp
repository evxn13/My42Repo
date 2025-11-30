/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Cat.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 16:28:37 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/10 20:46:45 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Cat.hpp"

Cat::Cat(void) {
    std::cout << "Cat constructor called" << std::endl;
    this->_type = "Cat";
}

Cat::~Cat(void)
{
    std::cout << "Cat destructor called" << std::endl;
}

Cat::Cat(Cat &src) : Animal(src)
{
    std::cout << "Cat copy constructor called" << std::endl;
    this->_type = src.getType();
}

Cat &Cat::operator=(Cat const &src)
{
    this->_type = src.getType();
    return *this;
}

std::string Cat::getType(void) const
{
    return this->_type;
}

void Cat::makeSound(void) const
{
    std::cout << "MEOOOOOOOOOOOOW MEOW" << std::endl;
}