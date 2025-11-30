#ifndef SPAN_TPP
#define SPAN_TPP

template <typename Iterator>
void Span::addNumber(Iterator begin, Iterator end)
{
    while (begin != end)
    {
        if (numbers.size() >= max_size)
            throw std::runtime_error("Span is full");
        numbers.push_back(*begin);
        ++begin;
    }
}

#endif
