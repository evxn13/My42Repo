#include "../include/Bureaucrat.hpp"

// colors
#define RED "\033[31m"
#define RESET "\033[0m"

int main()
{
    // grades valides
    try
    {
        Bureaucrat bob("Bob", 2);
        std::cout << bob << std::endl;
        
        bob.incrementGrade();
        std::cout << bob << std::endl;
        
        bob.incrementGrade();  // exception
        std::cout << bob << std::endl;
    }
    catch (std::exception &e)
    {
        std::cerr << RED << "Exception: " << RESET << e.what() << std::endl;
    }

    // grades valides (autre cas)
    try
    {
        Bureaucrat alice("Alice", 149);
        std::cout << alice << std::endl;
        
        alice.decrementGrade();
        std::cout << alice << std::endl;
        
        alice.decrementGrade();  // exception
        std::cout << alice << std::endl;
    }
    catch (std::exception &e)
    {
        std::cerr << RED << "Exception: " << RESET << e.what() << std::endl;
    }

    // grade trop élevé
    try
    {
        Bureaucrat invalidHigh("InvalidHigh", 0);  // exception
    }
    catch (std::exception &e)
    {
        std::cerr << RED << "Exception: " << RESET << e.what() << std::endl;
    }

    // Test de création avec un grade trop bas
    try
    {
        Bureaucrat invalidLow("InvalidLow", 151);  // exception
    }
    catch (std::exception &e)
    {
        std::cerr << RED << "Exception: " << RESET << e.what() << std::endl;
    }

    // Test de décrémentation et d'incrémentation supplémentaires
    try
    {
        Bureaucrat charlie("Charlie", 100);
        std::cout << charlie << std::endl;

        charlie.incrementGrade();
        std::cout << charlie << std::endl;

        charlie.decrementGrade();
        std::cout << charlie << std::endl;
    }
    catch (std::exception &e)
    {
        std::cerr << RED << "Exception: " << RESET << e.what() << std::endl;
    }

    // Test avec le grade minimum possible
    try
    {
        Bureaucrat dave("Dave", 1);
        std::cout << dave << std::endl;

        dave.incrementGrade();  // exception
    }
    catch (std::exception &e)
    {
        std::cerr << RED << "Exception: " << RESET << e.what() << std::endl;
    }

    // grade maximum possible
    try
    {
        Bureaucrat eve("Eve", 150);
        std::cout << eve << std::endl;

        eve.decrementGrade();  // exception
    }
    catch (std::exception &e)
    {
        std::cerr << RED << "Exception: " << RESET << e.what() << std::endl;
    }

    // incréments et décréments
    try
    {
        Bureaucrat frank("Frank", 75);
        std::cout << frank << std::endl;

        for (int i = 0; i < 74; ++i)
        {
            frank.incrementGrade();
        }
        std::cout << frank << std::endl; // grade 1

        frank.incrementGrade(); // exception
    }
    catch (std::exception &e)
    {
        std::cerr << RED << "Exception: " << RESET << e.what() << std::endl;
    }

    try
    {
        Bureaucrat grace("Grace", 75);
        std::cout << grace << std::endl;

        for (int i = 0; i < 75; ++i)
        {
            grace.decrementGrade();
        }
        std::cout << grace << std::endl; // grade 150

        grace.decrementGrade(); // exception
    }
    catch (std::exception &e)
    {
        std::cerr << RED << "Exception: " << RESET << e.what() << std::endl;
    }

    return 0;
}
