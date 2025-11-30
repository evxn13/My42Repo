#ifndef AFORM_HPP
#define AFORM_HPP

#include <string>
#include <iostream>
#include <exception>
#include "Bureaucrat.hpp"

class Bureaucrat;

class AForm {
    private:
        const std::string _name;
        bool _signed;
        const int _sign_grade;
        const int _exec_grade;

    protected:
        AForm(const std::string &name, int sign_grade, int exec_grade);

    public:
        virtual ~AForm();

        const std::string &getName() const;
        bool isSigned() const;
        int getSignGrade() const;
        int getExecGrade() const;

        void beSigned(const Bureaucrat &b);
        virtual void execute(const Bureaucrat &executor) const = 0;

        std::ostream &print(std::ostream &out) const;

        class GradeTooLowException : public std::exception {
            public:
                const char *what() const throw();
        };
        class GradeTooHighException : public std::exception {
            public:
                const char *what() const throw();
        };
        class FormNotSignedException : public std::exception {
            public:
                const char *what() const throw();
        };
};

std::ostream &operator<<(std::ostream &out, const AForm &form);

#endif
