/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   WrongCat.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 20:56:18 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/10 22:11:52 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "WrongCat.hpp"

WrongCat::WrongCat(void) {
    std::cout << "WrongCat constructor called" << std::endl;
    this->_type = "WrongCat";
}

WrongCat::~WrongCat(void) {std::cout << "WrongCat destructor called" << std::endl;}

WrongCat::WrongCat(WrongCat &src)  : WrongAnimal(src)
{
    std::cout << "WrongCat copy constructor called" << std::endl;
    this->_type = src.getType();
}

WrongCat &WrongCat::operator=(WrongCat const &src)
{
    this->_type = src.getType();
    return (*this);
}

void WrongCat::makeSound(void) const
{
    std::cout << "WrongCat sound" << std::endl;
}
