/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Zombie.hpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/20 17:01:55 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/20 17:01:55 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef ZOMBIE_H
#define ZOMBIE_H

#include <string>

class Zombie {
private:
    std::string name;

public:
    Zombie(std::string name);
    ~Zombie();
    void announce(void) const;
};

Zombie* newZombie(std::string name);
void randomChump(std::string name);

#endif
