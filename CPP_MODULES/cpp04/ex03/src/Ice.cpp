/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Ice.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/11 17:55:32 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/13 18:07:27 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Ice.hpp"

Ice::Ice() : _type("ice")
{
    std::cout << "ICE : " << this->_type << " constructed" << std::endl;
}

Ice::~Ice()
{
    std::cout << "ICE : " << this->_type << " destructed" << std::endl;
}

Ice::Ice(Ice const &src) : AMateria(src)
{
    std::cout << "ICE : " << this->_type << " constructed by copy" << std::endl;
}

Ice &Ice::operator=(Ice const &src)
{
    std::cout << "ICE : " << src.getType() << " assigned" << std::endl;
    return *this;
}

std::string const &Ice::getType() const
{
    return this->_type;
}

Ice *Ice::clone() const
{
    Ice *ret = new Ice;
    return ret;
}

void Ice::use(ICharacter &target)
{
    std::cout << "* shoots an ice bolt at " << target.getName() << " *" << std::endl;
}

