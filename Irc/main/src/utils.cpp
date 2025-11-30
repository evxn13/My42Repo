#include "utils.hpp"

std::string intToString(int const & pNbr) // can use template
{
    std::stringstream ss;
    ss << pNbr;
    return (ss.str());
}

std::string size_tToString(size_t const & pNbr) // can use template
{
    std::stringstream ss;
    ss << pNbr;
    return (ss.str());
}

std::string stringToUpper(std::string const & pStr)
{
    std::string outputUpper(pStr);
    for (std::string::iterator it = outputUpper.begin(); it < outputUpper.end(); it++)
        *it = std::toupper(*it); // if not lower will be ignored
    return (outputUpper);
}

std::vector<std::string> splitToVector(std::string const & pStr, char pDelim)
{
    std::vector<std::string> output;
    std::string::size_type start = 0;
    std::string::size_type end;

    while ((end = pStr.find(pDelim, start)) != std::string::npos)
    {
        if (end != start)
            output.push_back(pStr.substr(start, end - start));
        start = end + 1;
    }

    if (start < pStr.size())
        output.push_back(pStr.substr(start));

    return (output);
}

std::set<std::string> splitToSet(std::string const & pStr, char pDelim)
{
    std::set<std::string> output;
    std::string::size_type start = 0;
    std::string::size_type end;

    while ((end = pStr.find(pDelim, start)) != std::string::npos)
    {
        if (end != start)
            output.insert(pStr.substr(start, end - start));
        start = end + 1;
    }

    if (start < pStr.size())
        output.insert(pStr.substr(start));

    return (output);
}