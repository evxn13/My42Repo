/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Cure.hpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/11 18:04:56 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/13 18:09:04 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef CURE_H
#define CURE_H

#include "AMateria.hpp"

class Cure : public AMateria
{
    private:
        std::string _type;
    public:
        Cure();
        ~Cure();
        Cure(Cure const &src);
        Cure &operator=(Cure const &src);
        Cure *clone() const;
        void use(ICharacter &target);
        std::string const &getType() const; 
};

#endif
