#include "ft_irc.hpp"

int main(int argc, char **argv)
{
    if (argc != 3)
    {
        std::cerr << "Error: main: args need to be in format './ircserv <port> <password>'" << std::endl;
        return (MAIN_ERROR_ARGS);
    }
    else if (argv[1][0] == '\0')
    {
        std::cerr << "Error: main: need to have a non-empty port" << std::endl;
        return (MAIN_ERROR_PORT_EMPTY);
    }
    else if (argv[2][0] == '\0')
    {
        std::cerr << "Error: main: need to have a non-empty password" << std::endl;
        return (MAIN_ERROR_PASS_EMPTY);
    }

    char        *end;
    long int    port = strtol(argv[1], &end, 10);
    if (*end != '\0')
    {
        std::cerr << "Error: get_port: parsing port" << std::endl;
        return(MAIN_PORT_ERROR_PARS);
    }
    else if (errno == ERANGE)
    {
        std::cerr << "Error: get_port: ERANGE port" << std::endl;
        return (MAIN_PORT_ERROR_ERANGE);
    }
    else if (port < PORT_MIN || port > PORT_MAX)
    {
        std::cerr << "Error: get_port: need to be in the range [" << PORT_MIN << ", " << PORT_MAX << "]" << std::endl;
        return (MAIN_PORT_ERROR_RANGE);
    }
    
    Server  server(static_cast<int>(port), argv[2]);
    try
    {
        server.init();
    }
    catch (std::exception const & e)
    {
        std::cerr << e.what() << std::endl;
        return (MAIN_SERVER_INIT_ERROR);
    }
    catch (...)
    {
        std::cerr << "Unknown Error" << std::endl;
        return (MAIN_UNKNOWN_ERROR);
    }
    return (server.run());
}
