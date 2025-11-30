/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   zombie.hpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/20 17:25:47 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/20 17:25:47 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef ZOMBIE_H
#define ZOMBIE_H

#include <string>
#include <iostream>

class Zombie {

private:
	std::string name;

public:
	void	set_name(std::string name);
	Zombie();
	~Zombie( void );
	Zombie(std::string name);
	void announce(void) const;
};

Zombie* zombieHorde(int N, std::string name);

#endif