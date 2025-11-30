#ifndef FT_IRC_HPP
# define FT_IRC_HPP

# include <iostream>
# include <cstdlib> // for strtol
# include <cerrno> // for errno

# include "class/Server.hpp"

# ifndef PORT_MIN
#  define PORT_MIN 1024
# endif
# if PORT_MIN < 0
#  error "PORT_MIN cannot be below 0."
# endif

# ifndef PORT_MAX
#  define PORT_MAX 65535
# endif
# if PORT_MAX > 65535
#  error "PORT_MAX cannot exceed 65535."
# endif

#if PORT_MAX < PORT_MIN
#  error "PORT_MAX cannot be less than PORT_MIN."
#endif

enum e_exit_error
{
    MAIN_ERROR_ARGS = 1,
    MAIN_ERROR_PORT_EMPTY,
    MAIN_ERROR_PASS_EMPTY,
    MAIN_PORT_ERROR_PARS,
    MAIN_PORT_ERROR_ERANGE,
    MAIN_PORT_ERROR_RANGE,
    MAIN_SERVER_INIT_ERROR,
    MAIN_UNKNOWN_ERROR
};

#endif
