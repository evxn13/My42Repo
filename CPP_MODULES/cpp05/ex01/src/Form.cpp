#include "Form.hpp"
#include "Bureaucrat.hpp"

Form::Form(const std::string &name, int sign_grade, int exec_grade)
    : _name(name), _signed(false), _sign_grade(sign_grade), _exec_grade(exec_grade)
{
    if (sign_grade < 1 || exec_grade < 1)
        throw GradeTooHighException();

    if (sign_grade > 150 || exec_grade > 150)
        throw GradeTooLowException();
}

Form::Form(const Form &source) : _name(source._name), _signed(source._signed), _sign_grade(source._sign_grade), _exec_grade(source._exec_grade) {}

Form &Form::operator=(const Form &source)
{
    if (this != &source)
        this->_signed = source._signed;
    return *this;
}

Form::~Form() {}

void Form::sign(Bureaucrat &b)
{
    if (this->isSigned())
        throw std::logic_error("Form already signed");

    if (b.getGrade() > this->_sign_grade)
        throw GradeTooLowException();
    this->_signed = true;
}

const std::string &Form::getName() const { return this->_name; }
bool Form::isSigned() const { return this->_signed; }
int Form::getSignGrade() const { return this->_sign_grade; }
int Form::getExecGrade() const { return this->_exec_grade; }

const char *Form::GradeTooLowException::what() const throw() { return "Grade too low"; }

const char *Form::GradeTooHighException::what() const throw() { return "Grade too high"; }

std::ostream &operator<<(std::ostream &out, const Form &f)
{
    out << "Form: " << f.getName()
        << ", Signed: " << (f.isSigned() ? "Yes" : "No")
        << ", Sign grade: " << f.getSignGrade()
        << ", Execute grade: " << f.getExecGrade();
    return out;
}
