#include "Intern.hpp"

Intern::Intern() {}

Intern::Intern(const Intern &other) { (void)other; }

Intern &Intern::operator=(const Intern &other)
{
    (void)other;
    return *this;
}

Intern::~Intern() {}

static AForm *createShrubbery(const std::string &target) { return new ShrubberyCreationForm(target); }

static AForm *createRobotomy(const std::string &target) { return new RobotomyRequestForm(target); }

static AForm *createPresidential(const std::string &target) { return new PresidentialPardonForm(target); }

AForm *Intern::makeForm(const std::string &formName, const std::string &target)
{
    const std::string formNames[] = {"shrubbery creation", "robotomy request", "presidential pardon"};
    AForm *(*formCreators[])(const std::string &) = {
        &createShrubbery,
        &createRobotomy,
        &createPresidential
    };

    for (int i = 0; i < 3; ++i) {
        if (formName == formNames[i]) {
            std::cout << "Intern creates " << formName << std::endl;
            return formCreators[i](target);
        }
    }

    std::cerr << "Error: Form name \"" << formName << "\" does not exist." << std::endl;
    return NULL;
}
