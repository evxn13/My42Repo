#include "../include/Base.hpp"
#include <iostream>

Base* generate();
void identify(Base* p);
void identify(Base& p);

int main()
{
    Base* ptr = generate();
    identify(ptr);
    identify(*ptr);
    delete ptr;

    return 0;
}