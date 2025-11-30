#ifndef SERVER_HPP
# define SERVER_HPP

# include <string>
# include <iostream>
# include <stdexcept> // for runtime_error()
# include <map>
# include <limits>
# include <sstream>
# include <ctime> // for creationDate
# include <cerrno> // for errno
# include <cstring> // for memset

# include <string.h>
# include <unistd.h> // for close(), read()
# include <sys/socket.h>
# include <netinet/in.h> 
# include <arpa/inet.h>
# include <fcntl.h>
# include <sys/epoll.h> // for epoll_create1(), epoll_ctl(), struct epoll_event
# include <signal.h> // for sigaction
# include <sys/types.h>
# include <netdb.h>


# include "class/Channel.hpp"
# include "class/Client.hpp"
# include "cmd/cmd_handler.hpp"
# include "utils.hpp"

class Channel;
class Client;

# ifndef MAX_EVENTS
#  define            MAX_EVENTS 800
# endif
# if MAX_EVENTS < 1
#  error "MAX_EVENTS cannot be below 1."
# endif

# ifndef BUFFER_SIZE
#  define            BUFFER_SIZE 4095
# endif
# if BUFFER_SIZE > 65535
#  error "BUFFER_SIZE in this ft_irc have been cap 65535."
# endif

const size_t        RECVEXCESSFLOODLIMIT = 10;
const int           LISTEN_QUEUED = 8;
const std::string   SERVER_NAME_PREFIX_SPACED(":whereisyoursocket.irc ");
const std::string   SERVER_NAME("whereisyoursocket.irc");

typedef struct sockaddr_in  t_sockaddr_in;
typedef struct sockaddr	    t_sockaddr;

typedef struct epoll_event	t_epoll_event;

typedef struct sigaction	t_sigaction;

typedef struct s_epoll_package
{
    int             _fd_epoll;
    t_epoll_event   _tmp_event;
    int             _tmp_events_count;
    t_epoll_event   _events[MAX_EVENTS];
}   t_epoll_package;

class Server
{
    private:
        const int                           _port;
        const std::string                   _password;
        const std::string                   _startDate;
        int                                 _fd_socket;
        t_epoll_package                     _epollpkg;
        std::map<int, Client *>             _clientsServer;
        std::map<std::string, Channel *>    _channels;

    private:
        static bool _staticInitSucess;
        static bool _staticRunning;
        static int  _staticExitCode;
        static void SignalHandler(int pSignal);

    private:
        Server(void);
        Server(Server const & pCopy);
        Server & operator=(Server const & pRhs);
    public:
        Server(int const & pPort, std::string const & pPassword);
        ~Server(void);

    private:
        void init_socket(void);
        void init_sigaction(void);
        void init_epoll(void);
    public:
        void init(void);

    private:
        void run_newClient(void);
        void run_existingClient(int const & pEventFd);
    public:
        int run(void);

        std::string const & getPassword(void) const;
        std::string const & getStartDate(void) const;
        std::map<int, Client *> const & getClientsServer(void) const;
        Client * getClientServerByNick(const std::string & pNick);
        
        std::map<std::string, Channel *> const & getChannels(void) const;
        Channel * getChannelByName(std::string const & pName);
        Channel * createChannel(std::string const & pName);
        void removeInvitationFromClientsServer(std::string const & pChannelName);
        void deleteChannelByName(std::string const & pName);

        void disconnectClientFd(int clientFd);
        bool sendToClientFd(int const & pClientFd, std::string const & pMsg, bool const & pEnableServerPrefix);
        void sendToClientFdNoProtection(int const & pClientFd, std::string const & pMsg, bool const & pEnableServerPrefix);
        bool sendToClientErrorAndDisconnect(Client & pClient, std::string const & pErrorStr);
};

#endif
