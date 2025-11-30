/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Harl.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/22 11:38:43 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/22 11:38:43 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Harl.hpp"

void Harl::_debug(void) {
	std::cout << "I love having extra bacon for my 7XL-double-cheese-triple-pickle-special-ketchup burger." << std::endl << "I really do!" << std::endl << std::endl;
}

void Harl::_info(void) {
	std::cout << "I cannot believe adding extra bacon costs more money." << std::endl << "You didn’t put enough bacon in my burger! If you did, I wouldn’t be asking for more!" << std::endl << std::endl;
}

void Harl::_warning(void) {
	std::cout << "I think I deserve to have some extra bacon for free." << std::endl << "I’ve been coming for years whereas you started working here since last month." << std::endl << std::endl;
}

void Harl::_error(void) {
	std::cout << "This is unacceptable! I want to speak to the manager now." << std::endl << std::endl;
}

void Harl::filteredComplain(std::string level) {
	void (Harl::*fonction[])() = {&Harl::_debug, &Harl::_info, &Harl::_warning, &Harl::_error};
	std::string levels[] = {"DEBUG", "INFO", "WARNING", "ERROR"};

	int i;
	for (i = 0; i < 4 && levels[i] != level; ++i);

	switch (i) {
		case 0:
			std::cout << "[ DEBUG ]" << std::endl;
			(this->*fonction[0])();
			// fall through
		case 1:
			std::cout << "[ INFO ]" << std::endl;
			(this->*fonction[1])();
			// fall through
		case 2:
			std::cout << "[ WARNING ]" << std::endl;
			(this->*fonction[2])();
			// fall through
		case 3:
			std::cout << "[ ERROR ]" << std::endl;
			(this->*fonction[3])();
			break;
		default:
			std::cout << "[ Probably complaining about insignificant problems ]" << std::endl;
			break;
	}
}