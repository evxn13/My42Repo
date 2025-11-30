#include "utils.hpp"

std::string intToString(int const & pNbr)
{
    std::stringstream ss;
    ss << pNbr;
    return ss.str();
}
