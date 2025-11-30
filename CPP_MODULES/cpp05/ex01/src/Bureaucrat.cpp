#include "Bureaucrat.hpp"
#include "Form.hpp"

Bureaucrat::Bureaucrat(const std::string &name, int grade) : name(name), grade(grade)
{
    std::cout << "constructor\n";
    if (grade < 1)
        throw GradeTooHighException();
    if (grade > 150)
        throw GradeTooLowException();
}

//constructor copy

Bureaucrat::~Bureaucrat() { std::cout << "Bureaucrat destructor\n"; }

const std::string &Bureaucrat::getName() const
{
    // std::cout << "getter name\n";
    return name;
}

int Bureaucrat::getGrade() const
{
    // std::cout << "getter grade\n";
    return grade;
}

void Bureaucrat::incrementGrade()
{
    // std::cout << "increment grade\n";
    if (grade <= 1)
        throw GradeTooHighException();
    grade--;
}

void Bureaucrat::decrementGrade()
{
    // std::cout << "decrement grade\n";
    if (grade >= 150)
        throw GradeTooLowException();
    grade++;
}

void Bureaucrat::setGrade(int grade)
{
    if (grade < 1)
        throw GradeTooHighException();
    if (grade > 150)
        throw GradeTooLowException();
    this->grade = grade;
}

void Bureaucrat::signForm(Form &form)
{
    try {
        form.sign(*this);
        std::cout << this->name << " a signé le formulaire " << form.getName() << std::endl;
    } catch (const Form::GradeTooLowException &e) {
        std::cerr << this->name << " n'a pas pu signer le formulaire " << form.getName() << " car " << e.what() << std::endl;
    }
}

const char *Bureaucrat::GradeTooHighException::what() const throw()
{
    // std::cout << "grade too high\n";
    return "Grade is too high!";
}

const char *Bureaucrat::GradeTooLowException::what() const throw()
{
    // std::cout << "grade too low\n";
    return "Grade is too low!";
}

std::ostream &operator<<(std::ostream &out, const Bureaucrat &b)
{
    out << b.getName() << ", bureaucrat grade " << b.getGrade();
    return out;
}
