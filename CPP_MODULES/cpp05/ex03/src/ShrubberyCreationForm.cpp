#include "ShrubberyCreationForm.hpp"
#include <iostream>
#include <fstream>

ShrubberyCreationForm::ShrubberyCreationForm(const std::string &target)
    : AForm("ShrubberyCreationForm", 145, 137), _target(target) {
    std::cout << "ShrubberyCreationForm created for target: " << target << std::endl;
}

ShrubberyCreationForm::~ShrubberyCreationForm() {}

// Execute
void ShrubberyCreationForm::execute(const Bureaucrat &executor) const
{
    if (!isSigned())
        throw AForm::FormNotSignedException();
    if (executor.getGrade() > getExecGrade())
        throw AForm::GradeTooLowException();

    std::ofstream ofs((_target + "_shrubbery").c_str());
    if (ofs.fail())
        throw std::ofstream::failure("Error opening file");

    ofs << "        ccee88oo" << std::endl;
    ofs << "  C8O8O8Q8PoOb o8oo" << std::endl;
    ofs << " dOB69QO8PdUOpugoO9bD" << std::endl;
    ofs << "CgggbU8OU qOp qOdoUOdcb" << std::endl;
    ofs << "     6OuU  /p u gcoUodpP" << std::endl;
    ofs << "        \\\\//  /douUP" << std::endl;
    ofs << "          \\\\\\/////" << std::endl;
    ofs << "           |||/\\" << std::endl;
    ofs << "           |||\\/" << std::endl;
    ofs << "           |||||" << std::endl;
    ofs << "     .....//||||\\...." << std::endl;

    ofs.close();
    std::cout << "Shrubbery created in " << _target << "_shrubbery file." << std::endl;
}
