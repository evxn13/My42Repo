/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Cat.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 11:31:58 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/11 13:18:27 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef CAT_H
#define CAT_H

#include "Animal.hpp"
#include "Brain.hpp"

class Cat : public Animal
{
    private:
        std::string _type;
        Brain *_brain;
    public:
        Cat();
        ~Cat();
        Cat(Cat &src);
        
        Cat &operator=(Cat const &src);
        void makeSound() const;
        std::string getType() const;
        Brain *get_the_Brain() const;
        void Compare_brain_ideas(Cat const &cat) const;
};

#endif
