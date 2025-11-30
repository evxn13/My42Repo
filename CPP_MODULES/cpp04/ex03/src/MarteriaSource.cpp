/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   MarteriaSource.cpp                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/11 17:59:41 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/13 18:09:33 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "MateriaSource.hpp"
#include "AMateria.hpp"

MateriaSource::MateriaSource()
{
    std::cout << "MATERIASOURCE : " << "MateriaSource created" << std::endl;
    for (int i = 0; i < 4; i++)
        this->_inventory[i] = 0;
}

MateriaSource::MateriaSource(MateriaSource const & ref)
{
    for (int i = 0; i < 4; i++)
    {
        if (ref._inventory[i])
            this->_inventory[i] = (ref._inventory[i])->clone();
    }
    std::cout << "MATERIASOURCE : " << "Materia source was created from copy\n";
}


MateriaSource::~MateriaSource()
{
    std::cout << "MATERIASOURCE : " << "MateriaSource destructed" << std::endl;
    for (int i = 0; i < 4; i++)
    {
        if (this->_inventory[i])
        {
            std::cout << "Deleting materia in slot " << i << ": " << this->_inventory[i]->getType() << std::endl;
            delete this->_inventory[i];
        }
    }
}

MateriaSource & MateriaSource::operator=(MateriaSource const & src)
{
    for(int i = 0; i < 4; i++)
    {
        if (this->_inventory[i])
            delete this->_inventory[i];
        if (src._inventory[i])
            this->_inventory[i] = (src._inventory[i])->clone();
    }
    return (*this);
}


void MateriaSource::learnMateria(AMateria *src)
{
    int i = 0;
    while (this->_inventory[i] != 0 && i < 4)
        i++;
    if (i >= 4)
    {
        std::cout << "MATERIASOURCE : " << "Materia inventory is full. Cannot learn more materia." << std::endl;
        return;
    }
    this->_inventory[i] = src;
    std::cout << "MATERIASOURCE : " << "Learning materia of type: " << src->getType() << std::endl;
}

AMateria* MateriaSource::createMateria(std::string const & type)
{
    int i;

    for (i = 0; (this->_inventory)[i] && ((this->_inventory)[i])->getType() != type && i < 4; i++)
        ;
    if (i >= 4 || !(this->_inventory)[i])
    {
        std::cout << "MATERIASOURCE : " << type << " materia does not exit\n";
        return (NULL);
    }
    std::cout << "MATERIASOURCE : " << "Materia " << type << " created\n";
    return (((this->_inventory)[i])->clone());
}


  
