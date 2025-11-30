/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/21 15:04:42 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/21 15:04:42 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>

std::string readFileContents(const std::string& filename)
{
    std::ifstream file(filename.c_str());
    if (!file.is_open())
        throw std::runtime_error("Unable to open file: " + filename);
    std::stringstream buffer;
    buffer << file.rdbuf();
    file.close();
    return buffer.str();
}

void writeFileContents(const std::string& filename, const std::string& content)
{
    std::ofstream file(filename.c_str());
    if (!file.is_open())
        throw std::runtime_error("Unable to create file: " + filename);
    file << content;
    file.close();
}

std::string replaceOccurrences(const std::string& source, const std::string& from, const std::string& to)
{
    std::string result;
    std::string::size_type startPos = 0;
    std::string::size_type foundPos;

    while ((foundPos = source.find(from, startPos)) != std::string::npos)
	{
        result.append(source, startPos, foundPos - startPos);
        result.append(to);
        startPos = foundPos + from.length();
    }

    result.append(source, startPos, std::string::npos);
    return result;
}

int main(int argc, char* argv[])
{
    if (argc != 4)
	{
        std::cerr << "Usage: " << argv[0] << " <filename> <s1> <s2>" << std::endl;
        return 1;
    }
    std::string filename = argv[1];
    std::string s1 = argv[2];
    std::string s2 = argv[3];

    try
	{
        std::string content = readFileContents(filename);
        std::string modifiedContent = replaceOccurrences(content, s1, s2);
        writeFileContents(filename + ".replace", modifiedContent);
    }
	catch (const std::exception& e)
	{
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    return 0;
}

