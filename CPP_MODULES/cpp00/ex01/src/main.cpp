/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/20 14:43:30 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/20 14:43:30 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Phone_book.class.hpp"
#include <iomanip>

int	main(void)
{
	Phone_book	phone_book;
	std::string command;
	Contact		contact;
	std::string	first_name;
	std::string	last_name;
	std::string	phone_number;

	while (true)
	{
		std::cout << "\033[33mEnter a command (ADD, SEARCH or EXIT): \033[0m";
		std::getline(std::cin, command);

		if (command == "EXIT")
			break;
		else if (command == "ADD")
		{
			std::cout << "\033[33mEnter first name: \033[0m";
			std::getline(std::cin, first_name);
			contact.set_first_name(first_name);
			if (first_name.length() == 0)
			{
				std::cout << "\033[31mInvalid first name\033[0m" << std::endl;
				continue;
			}
			
			std::cout << "\033[33mEnter last name: \033[0m";
			std::getline(std::cin, last_name);
			contact.set_last_name(last_name);
			if (last_name.length() == 0)
			{
				std::cout << "\033[31mInvalid last name\033[0m" << std::endl;
				continue;
			}

			std::cout << "\033[33mEnter nickname: \033[0m";
			std::getline(std::cin, command);
			contact.set_nickname(command);
			if (command.length() == 0)
			{
				std::cout << "\033[31mInvalid nickname\033[0m" << std::endl;
				continue;
			}

			std::cout << "\033[33mEnter phone number: \033[0m";
			std::getline(std::cin, phone_number);
			contact.set_phone_number(phone_number);
			if (phone_number.length() == 0)
			{
				std::cout << "\033[31mInvalid phone number\033[0m" << std::endl;
				continue;
			}
			
			std::cout << "\033[33mEnter your darkest secret: \033[0m";
			std::getline(std::cin, command);
			contact.set_darkest_secret(command);
			if (command.length() == 0)
			{
				std::cout << "\033[31mInvalid darkest secret\033[0m" << std::endl;
				continue;
			}

			phone_book.add_contact(contact);
		}
		else if (command == "SEARCH")
		{
			std::cout << "     index|first name| last name|  nickname" << std::endl;
			for (int i = 0; i < 8; i++)
			{
				contact = phone_book.get_contact(i);
				std::cout << std::setw(10) << i << "|";
				if (contact.get_first_name().length() > 10)
					std::cout << contact.get_first_name().substr(0, 9) << ".|";
				else
					std::cout << std::setw(10) << contact.get_first_name() << "|";
				if (contact.get_last_name().length() > 10)
					std::cout << contact.get_last_name().substr(0, 9) << ".|";
				else
					std::cout << std::setw(10) << contact.get_last_name() << "|";
				if (contact.get_nickname().length() > 10)
					std::cout << contact.get_nickname().substr(0, 9) << ".|";
				else
					std::cout << std::setw(10) << contact.get_nickname() << "|";
				std::cout << std::endl;
			}
			std::cout << "Enter an index: ";
			std::getline(std::cin, command);
			if (command.length() == 1 && command[0] >= '0' && command[0] <= '7')
			{
				contact = phone_book.get_contact(command[0] - '0');
				std::cout << "First name: " << contact.get_first_name() << std::endl;
				std::cout << "Last name: " << contact.get_last_name() << std::endl;
				std::cout << "Nickname: " << contact.get_nickname() << std::endl;
				std::cout << "Phone number: " << contact.get_phone_number() << std::endl;
				std::cout << "Darkest secret: " << contact.get_darkest_secret() << std::endl << std::endl;
			}
			else 
				std::cout << "\033[31mInvalid index\033[0m" << std::endl;
		}
		else
			std::cout << "\033[31mInvalid command\033[0m" << std::endl;
	}
	return (0);
}