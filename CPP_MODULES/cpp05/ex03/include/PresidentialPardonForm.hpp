#ifndef PRESIDENTIAL_PARDON_FORM_HPP
#define PRESIDENTIAL_PARDON_FORM_HPP

#include "AForm.hpp"

class PresidentialPardonForm : public AForm {
    private:
        const std::string _target;

    public:
        PresidentialPardonForm(const std::string &target);
        ~PresidentialPardonForm();

        void execute(const Bureaucrat &executor) const;
};

#endif
