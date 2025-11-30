/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Phone_book.class.cpp                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/20 14:53:37 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/20 14:53:37 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Phone_book.class.hpp"

Phone_book::Phone_book(void) : _nb_contacts(0) {
	return;
}

Phone_book::~Phone_book(void) {
	return;
}

void	Phone_book::add_contact(const Contact& new_contact) {
	_contacts[_nb_contacts] = new_contact;
	_nb_contacts = (_nb_contacts + 1) % 8;
}

Contact Phone_book::get_contact(int index) const {
	if (index >= 0 && index < 8)
		return (_contacts[index]);
	else 
		return Contact();
}