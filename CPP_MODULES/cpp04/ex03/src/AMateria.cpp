/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   AMateria.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/11 17:29:41 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/13 18:07:58 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "AMateria.hpp"

AMateria::AMateria()
{
    std::cout << "AMATERIA : Abstract call of AMateria has been created" << std::endl;
}

AMateria::AMateria(std::string const & type) : _type(type)
{
    std::cout << "AMATERIA : Abstract constructor called of AMateria has been construct" << std::endl;
}

AMateria::~AMateria()
{
    std::cout << "AMATERIA : Abstract destructor called of AMateria" << std::endl;
}

AMateria::AMateria(AMateria const &src) : _type(src._type)
{
    std::cout << "AMATERIA : Abstract copy constructor called of AMateria" << std::endl;
}

std::string const &AMateria::getType() const
{
    return (this->_type);
}

void AMateria::use(ICharacter &target)
{
    std::cout << "AMATERIA : Abstract use function called of AMateria on : " << target.getName() << std::endl;
}
