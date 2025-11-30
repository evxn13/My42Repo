/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Dog.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 11:30:53 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/11 13:18:09 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef DOG_H
#define DOG_H

#include "Animal.hpp"
#include "Brain.hpp"

class Dog : public Animal
{
    private:
        std::string _type;
        Brain *_brain;
    public:
        Dog();
        ~Dog();
        Dog(Dog &src);
        
        Dog &operator=(Dog const &src);
        void makeSound() const;
        std::string getType() const;
        Brain *get_the_Brain() const;
        void Compare_brain_ideas(Dog const &dog) const;
};

#endif
