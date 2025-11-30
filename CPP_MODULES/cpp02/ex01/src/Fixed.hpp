/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Fixed.hpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evan <evan@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/12/05 19:11:02 by evan              #+#    #+#             */
/*   Updated: 2023/12/05 19:12:25 by evan             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef FIXED_HPP
#define FIXED_HPP

#include <iostream>
#include <cmath>

class Fixed {
    public:
        Fixed(void);
        Fixed(const Fixed &fixed);
        Fixed(const int bits);
        Fixed(const float bits);
        ~Fixed(void);

        Fixed &operator=(const Fixed &fixed);

        int getRawBits(void) const;
        void setRawBits(const int raw);
        float toFloat(void) const;
        int toInt(void) const;

    private:
        int _value;
        static const int _bits = 8;
};

std::ostream& operator<<(std::ostream& os, const Fixed &fixed);

#endif
