/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Fixed.hpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/22 13:27:30 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/22 13:27:30 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef FIXED_H
#define FIXED_H

#include <iostream>
#include <string>
#include <cmath>

class Fixed {
private:
	int _value;
	static const int _bits = 8;
public:
	Fixed();
	Fixed(const int Intval);
	Fixed(const float Floatval);
	Fixed(const Fixed &other);
	Fixed &operator=(const Fixed &other);
	~Fixed();

	bool operator>(const Fixed &other) const;
	bool operator<(const Fixed &other) const;	
	bool operator>=(const Fixed &other) const;
	bool operator<=(const Fixed &other) const;
	bool operator==(const Fixed &other) const;
	bool operator!=(const Fixed &other) const;

	Fixed operator+(const Fixed &other) const;
	Fixed operator-(const Fixed &other) const;
	Fixed operator*(const Fixed &other) const;
	Fixed operator/(const Fixed &other) const;	

	Fixed &operator++( void );
	Fixed operator++( int );
	Fixed &operator--( void );
	Fixed operator--( int );

	static 			Fixed min(Fixed &a, Fixed &b);
	static 	const	Fixed min(const Fixed &a, const Fixed &b);
	static 			Fixed max(Fixed &a, Fixed &b);
	static	const 	Fixed max(const Fixed &a, const Fixed &b);


	int 	getRawBits(void) const;
	void 	setRawBits(int const raw);

	float 	toFloat(void) const;
	int 	toInt(void) const;
};


std::ostream &operator<<(std::ostream &out, const Fixed &fixed);

#endif