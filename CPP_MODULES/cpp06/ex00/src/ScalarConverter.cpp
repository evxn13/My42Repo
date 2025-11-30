#include "../include/ScalarConverter.hpp"
#include <cctype>
#include <cmath>

void ScalarConverter::convert(const std::string& literal)
{
    double value;
    char* end;

    if (literal.length() == 1 && !std::isdigit(literal[0]))
        value = static_cast<double>(literal[0]);
    else if (literal.length() == 3 && literal[0] == '\'' && literal[2] == '\'')
        value = static_cast<double>(literal[1]);
    else
    {
        std::string temp = literal;
        if (!temp.empty() && (temp[temp.length() - 1] == 'f' || temp[temp.length() - 1] == 'F'))
            temp = temp.substr(0, temp.length() - 1);
        value = std::strtod(temp.c_str(), &end);
        if (*end != '\0' && *end != 'f' && *end != 'F')
        {
            std::cerr << "Invalid literal: " << literal << std::endl;
            return;
        }
    }
    printChar(value);
    printInt(value);
    printFloat(static_cast<float>(value));
    printDouble(value);
}

void ScalarConverter::printChar(double value)
{
    if (std::isnan(value) || std::isinf(value) || value < 0 || value > 127)
        std::cout << "char: impossible" << std::endl;
    else
    {
        char c = static_cast<char>(value);
        if (std::isprint(c))
            std::cout << "char: '" << c << "'" << std::endl;
        else
            std::cout << "char: non displayable" << std::endl;
    }
}

void ScalarConverter::printInt(double value)
{
    if (std::isnan(value) || std::isinf(value) || value < std::numeric_limits<int>::min() || value > std::numeric_limits<int>::max())
        std::cout << "int: impossible" << std::endl;
    else
        std::cout << "int: " << static_cast<int>(value) << std::endl;
}

void ScalarConverter::printFloat(float value)
{
    if (std::isnan(value))
        std::cout << "float: nanf" << std::endl;
    else if (std::isinf(value))
        std::cout << "float: " << (value > 0 ? "+inff" : "-inff") << std::endl;
    else
        std::cout << "float: " << std::fixed << std::setprecision(1) << value << "f" << std::endl;
}

void ScalarConverter::printDouble(double value)
{
    if (std::isnan(value))
        std::cout << "double: nan" << std::endl;
    else if (std::isinf(value))
        std::cout << "double: " << (value > 0 ? "+inf" : "-inf") << std::endl;
    else
        std::cout << "double: " << std::fixed << std::setprecision(1) << value << std::endl;
}