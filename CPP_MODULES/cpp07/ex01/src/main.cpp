#include <iostream>
#include "../include/Iter.hpp"

template <typename T>
void printElement(T& elem) { std::cout << elem << std::endl; }

int main()
{
    int arrayInt[] = {1, 2, 3, 4, 5};
    size_t lengthInt = sizeof(arrayInt) / sizeof(arrayInt[0]);

    iter(arrayInt, lengthInt, printElement);

    std::string arrayString[] = {"Hello", "World", "!"};
    size_t lengthString = sizeof(arrayString) / sizeof(arrayString[0]);

    iter(arrayString, lengthString, printElement);

    return 0;
}
