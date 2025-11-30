#include "../include/easyfind.hpp"
#include <iostream>
#include <vector>
#include <list>

int main()
{
    std::vector<int> vec;
    vec.push_back(1);
    vec.push_back(2);
    vec.push_back(3);
    vec.push_back(4);
    vec.push_back(5);

    std::list<int> lst;
    lst.push_back(10);
    lst.push_back(20);
    lst.push_back(30);
    lst.push_back(40);
    lst.push_back(50);
    
    try
    {
        std::vector<int>::iterator it = easyfind(vec, 3);
        std::cout << "Found in vector: " << *it << std::endl;

        std::list<int>::iterator it_lst = easyfind(lst, 30);
        std::cout << "Found in list: " << *it_lst << std::endl;

        it = easyfind(vec, 6);
    }
    catch (const std::exception& e) { std::cerr << e.what() << std::endl; }

    return 0;
}
