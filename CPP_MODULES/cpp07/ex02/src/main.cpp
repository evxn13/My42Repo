#include <iostream>
#include <cstdlib>
#include <ctime>
#include "../include/Array.hpp"

int main()
{
    srand(static_cast<unsigned int>(time(NULL)));
    Array<int> intArray(5);
    for (unsigned int i = 0; i < intArray.size(); i++)
    {
        int value = rand();
        intArray[i] = value;
        std::cout << "intArray[" << i << "] = " << intArray[i] << std::endl;
    }
    try
    {
        std::cout << intArray[10] << std::endl;
    }
    catch (const std::exception& e)
    {
        std::cerr << "Exception: " << e.what() << std::endl;
    }
    Array<int> copyArray(intArray);
    for (unsigned int i = 0; i < copyArray.size(); i++)
        std::cout << "copyArray[" << i << "] = " << copyArray[i] << std::endl;
    return 0;
}
