#include "../include/ScalarConverter.hpp"

int main(int argc, char** argv)
{
    if (argc != 2)
    {
        std::cerr << "Usage: " << argv[0] << " <literal> (needs to be a single character, a decimal number, or a string literal)" << std::endl;
        return 1;
    }
    ScalarConverter::convert(argv[1]);
    return 0;
}