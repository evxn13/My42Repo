// src/AForm.cpp
#include "AForm.hpp"

AForm::AForm(const std::string &name, int sign_grade, int exec_grade) : _name(name), _signed(false), _sign_grade(sign_grade), _exec_grade(exec_grade)
{
    if (sign_grade < 1 || exec_grade < 1)
        throw GradeTooHighException();
    if (sign_grade > 150 || exec_grade > 150)
        throw GradeTooLowException();
}

AForm::~AForm() {}

const std::string &AForm::getName() const { return _name; }
bool AForm::isSigned() const { return _signed; }
int AForm::getSignGrade() const { return _sign_grade; }
int AForm::getExecGrade() const { return _exec_grade; }

void AForm::beSigned(const Bureaucrat &b) {
    if (b.getGrade() > _sign_grade)
        throw GradeTooLowException();
    _signed = true;
}

const char *AForm::GradeTooLowException::what() const throw() { return "Grade too low."; }

const char *AForm::GradeTooHighException::what() const throw() { return "Grade too high."; }

const char *AForm::FormNotSignedException::what() const throw() { return "Form is not signed."; }

std::ostream &AForm::print(std::ostream &out) const
{
    out << "Form: " << _name
        << ", Signed: " << (_signed ? "Yes" : "No")
        << ", Sign grade: " << _sign_grade
        << ", Execute grade: " << _exec_grade;
    return out;
}

std::ostream &operator<<(std::ostream &out, const AForm &form) { return form.print(out); }
