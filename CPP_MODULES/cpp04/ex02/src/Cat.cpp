/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Cat.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 16:28:37 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/13 17:21:21 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Cat.hpp"
#include "Brain.hpp"

Cat::Cat(void) {
    std::cout << "Cat constructor called" << std::endl;
    this->_type = "Cat";
    this->_brain = new Brain();
}

Cat::~Cat(void)
{
    if (this->_brain)
        delete this->_brain;
    std::cout << "Cat destructor called" << std::endl;
}

Cat::Cat(Cat &src) : AAnimal(src)
{
    std::cout << "Cat copy constructor called" << std::endl;
    this->_brain = new Brain(*(src.get_the_Brain()));
    this->_type = src.getType();
}

Cat &Cat::operator=(Cat const &src)
{
    this->_type = src.getType();
    if (this->_brain)
        delete this->_brain;
    this->_brain = new Brain(*src.get_the_Brain());
    return *this;
}

void Cat::makeSound(void) const
{
    std::cout << "MOOOOOOOOOOOOEW MOEW" << std::endl;
}

std::string Cat::getType(void) const
{
    return this->_type;
}

Brain *Cat::get_the_Brain() const
{
    return this->_brain;
}

void Cat::Compare_brain_ideas(Cat const &Cat) const
{
    std::cout << std::endl << std::endl;
    for (int i = 0; i < 100; i++)
        std::cout << "_";
    std::cout << std::endl;
    std::cout << "My brain's heap address: " << static_cast<void*>(this->_brain) << std::endl;
    std::cout << "Other's heap address: " << static_cast<void*>(Cat.get_the_Brain()) << std::endl;
    for (int i = 0; i < 100; i++)
        std::cout << "_";
    std::cout << std::endl;
    std::cout << std::endl;
    std::cout << std::endl;
    std::cout << std::endl;
    std::cout << std::endl;
    std::cout << "Original Brain" << "\t || \t\t" << "Copy de l'original" << std::endl;
    for (int i = 0; i < 52; i++)
        std::cout << "_";
    std::cout << std::endl;
    for (int i = 0; i < 100; i++)
        std::cout << ((this->_brain)->getIdea())[i] << "\t\t || \t\t" << ((Cat.get_the_Brain())->getIdea())[i] << std::endl;
    for (int i = 0; i < 52; i++)
        std::cout << "_";
    std::cout << std::endl;
}
