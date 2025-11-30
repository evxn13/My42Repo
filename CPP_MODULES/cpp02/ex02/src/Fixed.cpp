/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Fixed.cpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/22 12:30:54 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/22 12:30:54 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Fixed.hpp"

Fixed::Fixed() : _value(0) {
}

Fixed::Fixed(const int intVal) : _value(intVal << _bits) {
}

Fixed::Fixed(const float floatVal) : _value(roundf(floatVal * (1 << _bits))) {
}

Fixed::Fixed(const Fixed &other) {
    *this = other;
}

Fixed &Fixed::operator=(const Fixed &other) {
    if (this != &other) {
        this->_value = other._value;
    }
    return *this;
}

Fixed::~Fixed() {
}

int Fixed::getRawBits() const {
    return this->_value;
}

void Fixed::setRawBits(int const raw) {
    this->_value = raw;
}

float Fixed::toFloat() const {
    return static_cast<float>(this->_value) / (1 << _bits);
}

int Fixed::toInt() const {
    return this->_value >> _bits;
}

bool Fixed::operator>(const Fixed &other) const {
    return this->_value > other._value;
}

bool Fixed::operator<(const Fixed &other) const {
    return this->_value < other._value;
}

bool Fixed::operator>=(const Fixed &other) const {
    return this->_value >= other._value;
}

bool Fixed::operator<=(const Fixed &other) const {
    return this->_value <= other._value;
}

bool Fixed::operator==(const Fixed &other) const {
    return this->_value == other._value;
}

bool Fixed::operator!=(const Fixed &other) const {
    return this->_value != other._value;
}

Fixed Fixed::operator+(const Fixed &other) const {
    return Fixed(this->toFloat() + other.toFloat());
}

Fixed Fixed::operator-(const Fixed &other) const {
    return Fixed(this->toFloat() - other.toFloat());
}

Fixed Fixed::operator*(const Fixed &other) const {
    return Fixed(this->toFloat() * other.toFloat());
}

Fixed Fixed::operator/(const Fixed &other) const {
    if (other._value == 0) {
        std::cerr << "Division by zero" << std::endl;
        return Fixed();
    }
    return Fixed(this->toFloat() / other.toFloat());
}

Fixed &Fixed::operator++() {
    this->_value++;
    return *this;
}

Fixed Fixed::operator++(int) {
    Fixed temp = *this;
    ++*this;
    return temp;
}

Fixed &Fixed::operator--() {
    this->_value--;
    return *this;
}

Fixed Fixed::operator--(int) {
    Fixed temp = *this;
    --*this;
    return temp;
}

Fixed       Fixed::min(Fixed &a, Fixed &b) {
    return a < b ? a : b;
}

const Fixed Fixed::min(const Fixed &a, const Fixed &b) {
    return a < b ? a : b;
}

Fixed       Fixed::max(Fixed &a, Fixed &b) {
    return a > b ? a : b;
}

const Fixed Fixed::max(const Fixed &a, const Fixed &b) {
    return a > b ? a : b;
}

std::ostream &operator<<(std::ostream &out, const Fixed &fixed) {
    out << fixed.toFloat();
    return out;
}
