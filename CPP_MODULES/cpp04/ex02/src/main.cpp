/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 22:40:37 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/11 13:21:24 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "AAnimal.hpp"
#include "Dog.hpp"
#include "Cat.hpp"
#include "Brain.hpp"
#include <cstdlib>

int main()
{
    // Partie sujet
    const AAnimal *j = new Dog();
    const AAnimal *i = new Cat();

    delete j; // should not create a leak
    delete i;

    // Partie tests perso   
    std::cout << std::endl;
    std::cout << std::endl;
    Dog dog1;
    Cat cat1;

    std::cout << std::endl;
    std::cout << std::endl;

    dog1.makeSound();
    cat1.makeSound();

    std::cout << std::endl;
    std::cout << std::endl;

    Dog &dog1_ref = dog1;
    Cat &cat1_ref = cat1;
    
    dog1_ref.makeSound();
    cat1_ref.makeSound();

    std::cout << std::endl;
    std::cout << std::endl;

    std::cout << "Je creer les copies" << std::endl;
    
    
    Dog dog1_copy(dog1_ref);
    Cat cat1_copy(cat1_ref);
    
    std::cout << std::endl;
    std::cout << std::endl;
    
    dog1_copy.makeSound();
    cat1_copy.makeSound();

    std::cout << std::endl;
    std::cout << std::endl;

    Dog &dog1_copy_ref = dog1_copy;
    Cat &cat1_copy_ref = cat1_copy;

    std::cout << std::endl;
    std::cout << std::endl;
    std::cout << std::endl;
    std::cout << "Je compare les cerveaux des Chiens et Chiens copy : " << std::endl;
    dog1.Compare_brain_ideas(dog1_copy_ref);
    std::cout << std::endl;
    std::cout << std::endl;
    std::cout << "Je compare les cerveaux des Chats et Chats copy : " << std::endl;
    cat1.Compare_brain_ideas(cat1_copy_ref);
    std::cout << std::endl;
    return 0;
}
