#ifndef SPAN_HPP
#define SPAN_HPP

#include <vector>
#include <algorithm>
#include <iostream>
#include <stdexcept>

class Span
{
private:
    unsigned int max_size;    // size max Span
    std::vector<int> numbers; // Conteneur nombre

public:
    Span(unsigned int N);
    ~Span();

    void addNumber(int number);
    
    // une plage d'itérateurs
    template <typename InputIt>
    void addRange(InputIt begin, InputIt end)
    {
        if (numbers.size() + std::distance(begin, end) > max_size)
            throw std::runtime_error("Span is full with range of numbers");
        numbers.insert(numbers.end(), begin, end);
    }

    int shortestSpan() const;
    int longestSpan() const;
};

#endif
