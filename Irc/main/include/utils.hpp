#ifndef UTILS_HPP
# define UTILS_HPP

# include <string>
# include <sstream>
# include <vector>
# include <set>

std::string intToString(int const & pNbr);
std::string size_tToString(size_t const & pNbr);
std::string stringToUpper(std::string const & pStr);
std::vector<std::string> splitToVector(std::string const & pStr, char pDelim);
std::set<std::string> splitToSet(std::string const & pStr, char pDelim);

#endif
