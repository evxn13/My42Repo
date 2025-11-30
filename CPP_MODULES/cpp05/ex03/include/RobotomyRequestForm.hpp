#ifndef ROBOTOMY_REQUEST_FORM_HPP
#define ROBOTOMY_REQUEST_FORM_HPP

#include "AForm.hpp"
#include <cstdlib>

class RobotomyRequestForm : public AForm {
    private:
        const std::string _target;

    public:
        RobotomyRequestForm(const std::string &target);
        ~RobotomyRequestForm();

        void execute(const Bureaucrat &executor) const;
};

#endif
