/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Brain.hpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid@student.42.fr <evscheid>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/10 22:40:54 by evscheid@st       #+#    #+#             */
/*   Updated: 2023/12/11 11:42:56 by evscheid@st      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef BRAIN_H
#define BRAIN_H

#include <iostream>
#include <string>
#include <sstream>

class Brain
{
    private:
        std::string *ideas;
    public:
        Brain();
        ~Brain();
        Brain(const Brain &src);
        
        Brain &operator=(const Brain &src);
        std::string *getIdea();
};

#endif
