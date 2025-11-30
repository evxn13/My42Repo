/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Dog.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 11:30:53 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/10 20:53:15 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef DOG_H
#define DOG_H

#include "Animal.hpp"

class Dog : public Animal
{
    private:
        std::string _type;
    public:
        Dog();
        ~Dog();
        Dog(Dog &src);
        
        Dog &operator=(Dog const &src);
        void makeSound() const;
        std::string getType() const;
};

#endif