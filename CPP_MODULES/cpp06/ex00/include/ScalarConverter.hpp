#ifndef SCALARCONVERTER_HPP
#define SCALARCONVERTER_HPP

#include <string>
#include <iostream>
#include <cstdlib>
#include <limits>
#include <iomanip>
#include <cmath>

class ScalarConverter {
public:
    static void convert(const std::string& literal);

private:
    ScalarConverter();

    static void printChar(double value);
    static void printInt(double value);
    static void printFloat(float value);
    static void printDouble(double value);
};

#endif