/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   MateriaSource.hpp                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/11 17:59:43 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/13 18:05:30 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef MATERIASOURCE_HPP
#define MATERIASOURCE_HPP

#include "IMateriaSource.hpp"

class MateriaSource : public IMateriaSource
{
    private:
        AMateria *_inventory[4];
    public:
        MateriaSource();
        MateriaSource(MateriaSource const & src);
        ~MateriaSource();
        MateriaSource &operator=(MateriaSource const & src);
        void learnMateria(AMateria *src);
        AMateria* createMateria(std::string const & type);
};

#endif
