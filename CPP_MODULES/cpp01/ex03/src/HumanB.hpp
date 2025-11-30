/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   HumanB.hpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/21 13:24:47 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/21 13:24:47 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef HUMANB_H
#define HUMANB_H

#include "Weapon.hpp"

class HumanB{
private:
	std::string	_name;
	Weapon*		_weapon;
public:
	HumanB(const std::string& name);
	void setWeapon(Weapon& weapon);
	void attack() const;
};

#endif