/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Brain.cpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 22:44:55 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/11 12:32:36 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Brain.hpp"

Brain::Brain()
{
    std::cout << "Brain constructor called" << std::endl;
    ideas = new std::string[100];
    for (int i = 0; i < 100; ++i)
    {
        std::ostringstream ss;
        ss << i;
        ideas[i] = "idea " + ss.str();
    }
    // for (int i = 0; i < 100; ++i) // pour afficher toutes les idées
    // {
    //     std::cout << ideas[i] << std::endl;
    // }
}

Brain::~Brain()
{
    std::cout << "Brain destructor called" << std::endl;
    delete [] this->ideas;
}

Brain::Brain(const Brain &src)
{
    std::cout << "Brain constructor from a copy" << std::endl;
    this->ideas = new std::string[100];
    for (int i = 0; i < 100; i++) {
        this->ideas[i] = src.ideas[i] + " copy profonde";
    }
}


Brain &Brain::operator=(const Brain &src)
{
    if (this == &src)
        return *this;

    std::cout << "Brain operator= called" << std::endl;
    delete [] this->ideas;
    this->ideas = new std::string[100];
    for (int i = 0; i < 100; i++) {
        this->ideas[i] = src.ideas[i];
    }
    return *this;
}


std::string *Brain::getIdea()
{
    return this->ideas;
}
