/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Phone_book.class.hpp                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/20 14:46:47 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/20 14:46:47 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PHONE_BOOK_CLASS_H
# define PHONE_BOOK_CLASS_H

#include "Contact.class.hpp"

class Phone_book {

private:
	Contact		_contacts[8];
	int			_nb_contacts;
public:
	Phone_book(void);
	~Phone_book(void);
	void			add_contact(const Contact& new_contact);
	Contact		get_contact(int index) const;
};

#endif