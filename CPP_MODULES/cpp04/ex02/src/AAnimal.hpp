/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   AAnimal.hpp                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 10:56:39 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/13 18:15:01 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef AANIMAL_H
#define AANIMAL_H

#include <iostream>
#include <cstdlib>

class AAnimal
{
    protected: 
        std::string _type;
    public:
        AAnimal();
        virtual ~AAnimal() =0;
        AAnimal(AAnimal const &src);
        AAnimal &operator=(AAnimal const &src);
        virtual void makeSound() const;
        virtual std::string getType() const =0;
};

#endif
