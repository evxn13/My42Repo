#include "Bureaucrat.hpp"
#include "ShrubberyCreationForm.hpp"
#include "RobotomyRequestForm.hpp"
#include "PresidentialPardonForm.hpp"

int main()
{
    try {
        Bureaucrat alice("Alice", 50);
        ShrubberyCreationForm shrubbery("Home");
        RobotomyRequestForm robotomy("Bender");
        PresidentialPardonForm pardon("Arthur Dent");

        std::cout << alice << std::endl;

        // Test Shrubbery
        alice.signForm(shrubbery);
        alice.executeForm(shrubbery);

        // Test Robotomy
        alice.setGrade(70); // grade to meet 
        alice.signForm(robotomy);
        alice.executeForm(robotomy);

        // Test Pardon
        alice.setGrade(5); // grade to meet
        alice.signForm(pardon);
        alice.executeForm(pardon);

    } catch (const std::exception &e) {
        std::cerr << "Exception: " << e.what() << std::endl;
    }
    return 0;
}
