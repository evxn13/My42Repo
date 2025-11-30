/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Ice.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/11 17:55:30 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/13 18:07:22 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef ICE_HPP
#define ICE_HPP

#include "AMateria.hpp"

class Ice : public AMateria
{
    private:
        std::string _type;
    public:
        Ice();
        ~Ice();
        Ice(Ice const &src);
        Ice &operator=(Ice const &src);
        std::string const &getType() const;
        Ice *clone() const;
        void use(ICharacter &target);
};

#endif

