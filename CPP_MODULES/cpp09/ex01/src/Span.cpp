#include "../include/Span.hpp"

Span::Span(unsigned int N) : max_size(N) { }

Span::~Span() { }

void Span::addNumber(int number)
{
    if (numbers.size() >= max_size)
        throw std::runtime_error("Span is full");
    numbers.push_back(number);
}

int Span::shortestSpan() const
{
    if (numbers.size() < 2)
        throw std::runtime_error("Not enough elements to find a span");

    std::vector<int> sorted(numbers);
    std::sort(sorted.begin(), sorted.end());

    int min_span = sorted[1] - sorted[0];
    for (size_t i = 2; i < sorted.size(); ++i)
        min_span = std::min(min_span, sorted[i] - sorted[i - 1]);

    return min_span;
}

int Span::longestSpan() const
{
    if (numbers.size() < 2)
        throw std::runtime_error("Not enough elements to find a span");

    return *std::max_element(numbers.begin(), numbers.end()) - *std::min_element(numbers.begin(), numbers.end());
}
