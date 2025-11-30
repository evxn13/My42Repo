/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 10:53:56 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/10 22:36:07 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Animal.hpp"
#include "Dog.hpp"
#include "Cat.hpp"
#include "WrongAnimal.hpp"
#include "WrongCat.hpp"

int main( void )
{
	const Animal* animal = new Animal();
	const Animal* dog = new Dog();
	const Animal* cat = new Cat();

	std::cout << std::endl;
	std::cout << "Dog->getType [" << dog->getType() << "] " << std::endl;
	std::cout << "Cat->getType [" << cat->getType() << "] " << std::endl;
	cat->makeSound(); //l'output doit afficher le son du chat, pas de l'animal !!
	dog->makeSound(); //l'output doit afficher le son du chien, pas de l'animal !!
	animal->makeSound(); //l'output doit afficher le son de l'animal !!

	std::cout << std::endl;
	const WrongAnimal* wrong_animal = new WrongAnimal();
	const WrongAnimal* wrong_cat = new WrongCat();

	std::cout << std::endl;
	
	std::cout << "WrongCat->getType [" << wrong_cat->getType() << "] " << std::endl;	
	std::cout << "WrongAnimal->getType [" << wrong_animal->getType() << "] " << std::endl;
	
	std::cout << std::endl;

	wrong_cat->makeSound();
	wrong_animal->makeSound();
	
	std::cout << std::endl;

	delete animal;
	delete dog;
	delete cat;
	delete wrong_cat;
	delete wrong_animal;
}

