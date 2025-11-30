#ifndef EASYFIND_HPP
#define EASYFIND_HPP

#include <stdexcept>
#include <algorithm>
#include <iterator>

template <typename T>
typename T::iterator easyfind(T& container, int value);

#include "easyfind.tpp"

#endif
