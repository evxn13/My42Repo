#ifndef FORM_HPP
#define FORM_HPP

#include <string>
#include <iostream>
#include <exception>
#include "Bureaucrat.hpp"

class Form {
    private:
        const std::string _name;
        bool _signed;
        const int _sign_grade;
        const int _exec_grade;

    public:
        Form(const std::string &name, int sign_grade, int exec_grade);
        Form(const Form &source);
        Form &operator=(const Form &source);
        ~Form();

        void sign(Bureaucrat &b);

        const std::string &getName() const;
        bool isSigned() const;
        int getSignGrade() const;
        int getExecGrade() const;

        class GradeTooLowException : public std::exception {
            public:
                const char *what() const throw();
        };

        class GradeTooHighException : public std::exception {
            public:
                const char *what() const throw();
        };
};

std::ostream &operator<<(std::ostream &out, const Form &f);

#endif
