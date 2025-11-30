/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Character.cpp                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/11 17:47:40 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/13 18:07:46 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Character.hpp"
#include <cstdlib>

Character::Character(std::string name) : _name(name)
{
    std::cout << "CHARACTER : " << "Character Constructor called of : " << this->_name << std::endl;
    for (int i = 0; i < 4; i++)
        this->_inventory[i] = 0;
}

Character::Character(Character const &src) : _name(src.getName() + "_copy")
{
    std::cout << "CHARACTER : " << "Character Copy constructor called of : " << this->_name << std::endl;
    for (int i = 0; i < 4; i++) 
    {
        if (src._inventory[i])
            this->_inventory[i] = (src._inventory[i])->clone();
    }
}

Character::~Character()
{
    std::cout << "CHARACTER : " << "Character Destructor called of : " << this->_name << std::endl;
    for (int i = 0; i < 4; i++)
    {
        if (this->_inventory[i])
            delete this->_inventory[i];
    }
}

std::string const &Character::getName() const
{
    return this->_name;
}

Character &Character::operator=(Character const &src)
{
    std::cout << "CHARACTER : " << "Character Assignation operator called of : " << src.getName() << std::endl;
    for (int i = 0; i < 4; i++)
    {
        if (this->_inventory[i])
            delete this->_inventory[i];
        if (src._inventory[i])
            this->_inventory[i] = (src._inventory[i])->clone();
    }
    return *this;
}

void Character::use(int i, ICharacter &target)
{
    if (i < 0 || i >= 4 || !this->_inventory[i])
    {
        std::cout << "CHARACTER : " << "No materia in this slot" << std::endl;
        return ;
    }
    this->_inventory[i]->use(target);
}

void Character::equip(AMateria *src)
{
    if (!src)
    {
        std::cout << "CHARACTER : " << "No materia to equip because nothing" << std::endl;
        return ;
    }
    for (int i = 0; i < 4; i++)
    {
        if (!this->_inventory[i])
        {
            this->_inventory[i] = src;
            return ;
        }
    }
    std::cout << "CHARACTER : " << this->getName() << " inventory is full" << std::endl;
}

void Character::unequip(int i)
{
    if (i < 0 || i > 3 || !this->_inventory[i])
    {
        std::cout << "CHARACTER : " << this->getName() << "No materia in this slot" << std::endl;
        return ;
    }
    else
    {
        AMateria *tmp = this->_inventory[i];
        this->_inventory[i] = 0;
        std::cout << "CHARACTER : " << this->getName() << ": Unequiped " << tmp->getType() << std::endl;
    }
}

AMateria *Character::get_Material(int i)
{
    std::cout << i;
    return this->_inventory[i];
}   
