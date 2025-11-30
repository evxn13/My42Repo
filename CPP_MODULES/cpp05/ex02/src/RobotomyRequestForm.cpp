#include "RobotomyRequestForm.hpp"
#include <iostream>

RobotomyRequestForm::RobotomyRequestForm(const std::string &target) : AForm("RobotomyRequestForm", 72, 45), _target(target) {}

RobotomyRequestForm::~RobotomyRequestForm() {}

// Execute
void RobotomyRequestForm::execute(const Bureaucrat &executor) const
{
    if (!isSigned())
        throw FormNotSignedException();
    if (executor.getGrade() > getExecGrade())
        throw GradeTooLowException();

    std::cout << "Bzzzz... Drilling noises..." << std::endl;
    if (rand() % 2 == 0)
        std::cout << _target << " has been successfully robotomized!" << std::endl;
    else
        std::cout << "Robotomy on " << _target << " failed!" << std::endl;
}
