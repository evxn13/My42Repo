#include "Bureaucrat.hpp"
#include "Intern.hpp"

int main()
{
    try {
        Intern someRandomIntern;
        Bureaucrat alice("Alice", 50);

        // Test ShrubberyCreationForm
        AForm *form1 = someRandomIntern.makeForm("shrubbery creation", "Garden");
        if (form1)
        {
            alice.signForm(*form1);
            alice.executeForm(*form1);
            delete form1; // free
        }

        // Test RobotomyRequestForm
        AForm *form2 = someRandomIntern.makeForm("robotomy request", "Bender");
        if (form2)
        {
            alice.setGrade(45); // Ajuste le grade pour exécuter
            alice.signForm(*form2);
            alice.executeForm(*form2);
            delete form2; // free
        }

        // Test PresidentialPardonForm
        AForm *form3 = someRandomIntern.makeForm("presidential pardon", "Arthur Dent");
        if (form3)
        {
            alice.setGrade(5); // Ajuste le grade pour exécuter
            alice.signForm(*form3);
            alice.executeForm(*form3);
            delete form3; // free
        }

        // formulaire inconnu
        AForm *form4 = someRandomIntern.makeForm("unknown form", "Target");
        if (form4)
        {
            delete form4; // free, si par erreur quelque chose est créé
        }
    } catch (const std::exception &e) {
        std::cerr << "Exception: " << e.what() << std::endl;
    }

    return 0;
}
