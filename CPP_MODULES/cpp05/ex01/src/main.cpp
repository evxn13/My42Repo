#include "../include/Bureaucrat.hpp"
#include "../include/Form.hpp"

int main()
{
    try {
        Bureaucrat alice("Alice", 50);
        std::cout << alice << std::endl;

        Form formA("Form_A", 45, 30);
        std::cout << formA << std::endl;

        alice.signForm(formA);
        std::cout << formA << std::endl;

        // Test: Signer un formulaire déjà signé
        alice.signForm(formA);
    } catch (const std::exception &e) {
        std::cerr << "Exception: " << e.what() << std::endl;
    }
    try {
        Bureaucrat bruno("BRUNO", 35);
        std::cout << bruno << std::endl;

        Form formB("Form_B", 45, 30);
        std::cout << formB << std::endl;

        bruno.signForm(formB);
        std::cout << formB << std::endl;

        // Test: Signer un formulaire déjà signé
        bruno.signForm(formB);
    } catch (const std::exception &e) {
        std::cerr << "Exception: " << e.what() << std::endl;
    }
    return 0;
}
