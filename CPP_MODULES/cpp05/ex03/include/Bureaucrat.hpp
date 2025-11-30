#ifndef BUREAUCRAT_HPP
#define BUREAUCRAT_HPP

#include <string>
#include <iostream>
#include <exception>

class AForm;

class Bureaucrat {
    private:
        const std::string name;
        int grade;

    public:
        Bureaucrat(const std::string &name, int grade);
        Bureaucrat(const Bureaucrat &other);
        ~Bureaucrat();

        const std::string &getName() const;
        int getGrade() const;

        void incrementGrade();
        void decrementGrade();
        void setGrade(int grade);

        class GradeTooHighException : public std::exception {
            public:
                const char *what() const throw();
        };

        class GradeTooLowException : public std::exception {
            public:
                const char *what() const throw();
        };

        void signForm(AForm &form);
        void executeForm(const AForm &form) const;
};

std::ostream &operator<<(std::ostream &out, const Bureaucrat &b);

#endif
