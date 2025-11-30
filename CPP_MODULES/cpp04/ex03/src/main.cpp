/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 22:40:37 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/13 18:06:59 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "AMateria.hpp"
#include "Character.hpp"
#include "Cure.hpp"
#include "Ice.hpp"
#include "ICharacter.hpp"
#include "IMateriaSource.hpp"
#include "MateriaSource.hpp"
#include <iostream>

void ft_custom_tests()
{
    const std::string RED = "\033[31m";
    const std::string GREEN = "\033[32m";
    const std::string YELLOW = "\033[33m";
    const std::string CYAN = "\033[36m";
    const std::string RESET = "\033[0m";

    std::cout << CYAN << "\nCONSTRUCTORS:" << RESET << std::endl;
    std::cout << "-------------" << std::endl;
    IMateriaSource* source = new MateriaSource();
    source->learnMateria(new Ice());
    source->learnMateria(new Cure());
    ICharacter* hero = new Character("hero");
    std::cout << std::endl;

    
    std::cout << GREEN << "CREATION MATERIAS:" << RESET << std::endl;
    std::cout << "------------------" << std::endl;
    AMateria* temp;

    temp = source->createMateria("ice");
    hero->equip(temp);
    temp = source->createMateria("cure");
    hero->equip(temp);
    temp = source->createMateria("lightning"); // null
    hero->equip(temp);
    std::cout << std::endl;

    std::cout << YELLOW << "\"USE\": sur un nouveau PERSONNAGE !" << RESET << std::endl;
    std::cout << "----------------------------------" << std::endl;
    ICharacter* villain = new Character("villain");
    hero->use(0, *villain);
    hero->use(1, *villain);
    std::cout << std::endl;
    hero->use(2, *villain); // vide
    std::cout << std::endl;

    std::cout << GREEN << "COPY PROFONDE:" << RESET << std::endl;
    std::cout << "--------------" << std::endl;
    Character* wizard = new Character("wizard");
    temp = source->createMateria("cure");
    wizard->equip(temp);
    Character* wizard_copy = new Character(*wizard);
    std::cout << std::endl;

    std::cout << YELLOW << "COPY PROFONDE par rapport a l'original:" << RESET << std::endl;
    std::cout << "--------------------------------------" << std::endl;
    wizard->unequip(0);
    wizard->use(0, *villain);
    std::cout << std::endl;
    wizard_copy->use(0, *villain);
    std::cout << std::endl;

    std::cout << RED << "ON DESEQUIPE :" << RESET << std::endl;
    std::cout << "--------------" << std::endl;
    hero->unequip(3); // vide
    std::cout << std::endl;
    hero->use(1, *wizard);
    hero->unequip(1); // Déséquiper un emplacement valide
    hero->use(1, *wizard);
    std::cout << std::endl;

    // Destructeurs
    std::cout << RED << "DESTRUCTORS:" << RESET << std::endl;
    std::cout << "------------" << std::endl;
    delete villain;
    delete hero;
    delete source;
    delete wizard;
    delete wizard_copy;
    std::cout << std::endl;
}

int main()
{
    IMateriaSource* src = new MateriaSource();
    src->learnMateria(new Ice());
    src->learnMateria(new Cure());
    ICharacter* me = new Character("me");
    AMateria* tmp;
    
    tmp = src->createMateria("ice");
    me->equip(tmp);
    tmp = src->createMateria("cure");
    me->equip(tmp);
    
    ICharacter* bob = new Character("bob");
    std::cout << std::endl << std::endl << std::endl;
    me->use(0, *bob);
    me->use(1, *bob);
    std::cout << std::endl << std::endl << std::endl;
    
    delete bob;
    delete me;
    delete src;
    // ft_custom_tests();
    return 0;
}