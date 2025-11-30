/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Cure.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/11 18:04:58 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/13 18:07:37 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Cure.hpp"

Cure::Cure() : _type("cure")
{
    std::cout << "CURE : " << "Constructor called of : " << this->_type << std::endl;
}

Cure::Cure(Cure const &src) : AMateria(src)
{
    std::cout << "CURE : " << "Copy constructor called of : " << this->_type << std::endl;
}

Cure::~Cure()
{
    std::cout << "CURE : " << "Destructor called of : " << this->_type << std::endl;
}

Cure &Cure::operator=(Cure const &src)
{
    std::cout << "CURE : " << "Assignation operator called of : " << src.getType() << std::endl;
    return *this;
}

std::string const &Cure::getType() const
{
    return this->_type;
}

Cure *Cure::clone() const
{
    Cure *clone = new Cure;
    return clone;
}

void Cure::use(ICharacter &target)
{
    std::cout << "* heals " << target.getName() << "'s wounds *" << std::endl;
}
