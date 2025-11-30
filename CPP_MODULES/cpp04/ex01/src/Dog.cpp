/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Dog.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 16:49:38 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/13 16:43:28 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Dog.hpp"
#include "Brain.hpp"

Dog::Dog(void) {
    std::cout << "Dog constructor called" << std::endl;
    this->_type = "Dog";
    this->_brain = new Brain();
}

Dog::~Dog(void)
{
    if (this->_brain)
        delete this->_brain;
    std::cout << "Dog destructor called" << std::endl;
}

Dog::Dog(Dog &src) : Animal(src)
{
    std::cout << "Dog copy constructor called" << std::endl;
    this->_brain = new Brain(*(src.get_the_Brain()));
    this->_type = src.getType();
}

Dog &Dog::operator=(Dog const &src)
{
    this->_type = src.getType();
    if (this->_brain)
        delete this->_brain;
    this->_brain = new Brain(*src.get_the_Brain());
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

Brain *Dog::get_the_Brain() const
{
    return this->_brain;
}

void Dog::Compare_brain_ideas(Dog const &dog) const
{
    std::cout << std::endl << std::endl;
    for (int i = 0; i < 100; i++)
        std::cout << "_";
    std::cout << std::endl;
    std::cout << "My brain's heap address: " << static_cast<void*>(this->_brain) << std::endl;
    std::cout << "Other's heap address: " << static_cast<void*>(dog.get_the_Brain()) << std::endl;
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
        std::cout << ((this->_brain)->getIdea())[i] << "\t\t || \t\t" << ((dog.get_the_Brain())->getIdea())[i] << std::endl;
    for (int i = 0; i < 52; i++)
        std::cout << "_";
    std::cout << std::endl;
}
