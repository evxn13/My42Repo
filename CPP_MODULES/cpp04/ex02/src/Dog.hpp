/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Dog.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 11:30:53 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/11 13:22:19 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef DOG_H
#define DOG_H

#include "AAnimal.hpp"
#include "Brain.hpp"

class Dog : public AAnimal
{
    private:
        std::string _type;
        Brain *_brain;
    public:
        Dog();
        ~Dog();
        Dog(Dog &src);
        
        Dog &operator=(Dog const &src);
        std::string getType() const;
        void makeSound() const;
        void Compare_brain_ideas(Dog const &dog) const;
        Brain *get_the_Brain() const;
};

#endif
