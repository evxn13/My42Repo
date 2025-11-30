/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   WrongCat.hpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 20:54:24 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/10 22:20:12 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef WRONGCAT_H
#define WRONGCAT_H

#include "WrongAnimal.hpp"

class WrongCat : public WrongAnimal
{
    protected:
        std::string _type;
    public:
        WrongCat();
        ~WrongCat();
        WrongCat(WrongCat &src);
        
        WrongCat &operator=(WrongCat const &src);
        void makeSound() const;
};

#endif