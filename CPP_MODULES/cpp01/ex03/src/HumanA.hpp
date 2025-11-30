/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   HumanA.hpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/21 13:24:42 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/21 13:24:42 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef HUMANA_H
#define HUMANA_H

#include "Weapon.hpp"

class HumanA{
private:
	std::string	_name;
	Weapon&		_weapon;
public:
	HumanA(const std::string& name, Weapon& weapon);
	void attack() const;
};

#endif