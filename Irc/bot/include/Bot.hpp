#ifndef BOT_HPP
# define BOT_HPP

# include <string>
# include <iostream>
# include <stdexcept> // for runtime_error()
# include <map>
# include <vector>
# include <algorithm>
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

// bonus
# include "openssl/bio.h"
# include "openssl/ssl.h"
# include "openssl/err.h"

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
const size_t        CMD_MAX_SIZE = 510;
const int           MAX_ATTEMPT = 100;

const std::string   ERR_NICKNAMEINUSE("433");

const std::string   BOT_NICK("mistral");
const std::string   BOT_USERNAME("mistruser");
const size_t        BOT_MAXRESPONDESIZE = 422;
const size_t        BOT_RESPONDSPACEMARGIN = 23;
const std::string   BOT_APIURL("api.mistral.ai");
const std::string   BOT_APIKEY("3cx90lxyaZDYkJprZhEU7jXZHsZMwa1B"); // the key should be in ENV but for simplicity it's write in brute
const std::string   BOT_SSLCACERT("./bot/lib/cacert.pem"); // relative path don't move executable

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

// bonus
typedef struct s_ssl_package
{
    std::string clientName;
    SSL *   ssl;
    BIO *   bio;
}   t_ssl_package;

class Bot
{
    private:
        const std::string                   _ipv4;
        const int                           _port;
        const std::string                   _password;
        int                                 _fd_socket;
        t_epoll_package                     _epollpkg;
        SSL_CTX *                           _ctx;
        std::map<int, t_ssl_package>        _bots;

    private:
        static bool _staticInitSucess;
        static bool _staticRunning;
        static int  _staticExitCode;
        static void SignalHandler(int pSignal);

    private:
        Bot(void);
        Bot(Bot const & pCopy);
        Bot & operator=(Bot const & pRhs);
    public:
        Bot(std::string const & pIPV4, int const & pPort, std::string const & pPassword);
        ~Bot(void);

    private:
        void init_socket(void);
        void init_sigaction(void);
        void init_epoll(void);
        void init_botSSL(void);
    public:
        void init(void);

    private:
        void manageCmd(std::string const & pCmd);
        void run_server(void);
        void run_Bot(std::map<int, t_ssl_package>::iterator pBotIt);
    public:
        int run(void);

        void sendToServerNoProtection(std::string const & pMsg);
        void sendToBotPartialProtection(std::string const & pClientTargetName, std::string const & pMsg);
    private:
        int createBot(std::string const & pClientTargetName);
        void disconnectDeleteBot(std::map<int, t_ssl_package>::iterator pBotIt);
};

#endif
