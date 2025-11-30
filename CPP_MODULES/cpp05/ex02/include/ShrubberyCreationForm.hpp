#ifndef SHRUBBERY_CREATION_FORM_HPP
#define SHRUBBERY_CREATION_FORM_HPP

#include "AForm.hpp"
#include <fstream>

class ShrubberyCreationForm : public AForm {
    private:
        const std::string _target;

    public:
        // Constructors
        ShrubberyCreationForm(const std::string &target);
        ~ShrubberyCreationForm();

        // Execute
        void execute(const Bureaucrat &executor) const;
};

#endif
