/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Weapon.hpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/21 13:24:52 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/21 13:24:52 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef WEAPON_H
#define WEAPON_H

#include <iostream>
#include <string>

class Weapon{
private:
	std::string	_type;
public:
	Weapon(const std::string& type);
	const std::string& getType() const;
	void setType(const std::string& type);
};

#endif