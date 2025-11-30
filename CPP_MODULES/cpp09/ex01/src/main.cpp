#include "../include/Span.hpp"
#include <iostream>
#include <vector>
#include <cstdlib>
#include <ctime>

int main()
{
    try
    {
        std::cout << "==== Test basique ====" << std::endl;
        Span sp = Span(5);
        sp.addNumber(6);
        sp.addNumber(3);
        sp.addNumber(17);
        sp.addNumber(9);
        sp.addNumber(11);

        std::cout << "Shortest Span: " << sp.shortestSpan() << std::endl;
        std::cout << "Longest Span: " << sp.longestSpan() << std::endl;

        std::cout << "\n==== Test avec une plage d'itérateurs ====" << std::endl;
        std::vector<int> vec;
        vec.push_back(10);
        vec.push_back(20);
        vec.push_back(30);
        vec.push_back(40);
        vec.push_back(50);

        Span sp2(10);
        sp2.addRange(vec.begin(), vec.end());
        sp2.addNumber(5);
        sp2.addNumber(60);

        std::cout << "Shortest Span: " << sp2.shortestSpan() << std::endl;
        std::cout << "Longest Span: " << sp2.longestSpan() << std::endl;

        std::cout << "\n==== Test avec 10 000 nombres ====" << std::endl;
        Span sp3(10000);
        std::srand(std::time(NULL));
        for (int i = 0; i < 10000; ++i)
            sp3.addNumber(std::rand());

        std::cout << "Shortest Span: " << sp3.shortestSpan() << std::endl;
        std::cout << "Longest Span: " << sp3.longestSpan() << std::endl;
    }
    catch (const std::exception &e)
    {
        std::cerr << e.what() << std::endl;
    }
    return 0;
}
