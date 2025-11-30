/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Character.hpp                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/11 17:47:43 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/13 18:07:42 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef CHARACTER_HPP
#define CHARACTER_HPP

#include "ICharacter.hpp"

class Character : public ICharacter
{
    private:
        std::string const _name;
        AMateria *_inventory[4];
    public:
        Character(std::string name);
        Character(Character const &src);
        ~Character();
        Character           &operator=(Character const &src);
        std::string const & getName() const;
        void                use(int i, ICharacter &target);
        void                equip(AMateria *src);
        void                unequip(int i);
        AMateria            *get_Material(int i);
};

#endif
