/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Cat.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 11:31:58 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/10 20:53:21 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef CAT_H
#define CAT_H

#include "Animal.hpp"

class Cat : public Animal
{
    private:
        std::string _type;
    public:
        Cat();
        ~Cat();
        Cat(Cat &src);
        
        Cat &operator=(Cat const &src);
        void makeSound() const;
        std::string getType() const;
};

#endif
