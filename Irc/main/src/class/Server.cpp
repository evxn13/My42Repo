#include "class/Server.hpp"

bool Server::_staticInitSucess = false;
bool Server::_staticRunning = true;
int Server::_staticExitCode = 0;

void Server::SignalHandler(int pSignal) // static function
{
    Server::_staticRunning = false;
    if (pSignal == SIGINT || pSignal == SIGTERM)
        Server::_staticExitCode = 0;
    else
        Server::_staticExitCode = 128 + pSignal;
}




static std::string getCurrentDateTime(void)
{
    std::time_t now = std::time(0);
    std::tm* timeinfo = std::localtime(&now);
    char buf[80];

    std::strftime(buf, sizeof(buf), "%a %b %e %Y at %H:%M:%S UTC%z", timeinfo);
    return std::string(buf);
}

Server::Server(int const & pPort, std::string const & pPassword) 
: _port(pPort), _password(pPassword), _startDate(getCurrentDateTime())
{
}

Server::~Server(void)
{
    if (Server::_staticInitSucess == true)
    {
        for (std::map<int, Client *>::iterator it = this->_clientsServer.begin(); it != this->_clientsServer.end(); it++)
        {
            std::string const & message = "ERROR :Closing Link: " + it->second->getClientHostname() + " (The server is shutting down)";
            if (send(it->first, message.c_str(), message.length(), 0) < 0)
                std::cerr << "Error: Server::cleanServer: send fail for fd " << it->first << std::endl;
            if (epoll_ctl(this->_epollpkg._fd_epoll, EPOLL_CTL_DEL, it->first, NULL) < 0)
                std::cerr << "Error: Server::cleanServer: EPOLL_CTL_DEL client fd fail for fd " << it->first << std::endl;
        }
        if (epoll_ctl(this->_epollpkg._fd_epoll, EPOLL_CTL_DEL, this->_fd_socket, &this->_epollpkg._tmp_event) < 0)
            std::cerr << "Error: Server::cleanServer: EPOLL_CTL_DEL server fd fail at fd " << this->_fd_socket << std::endl;
        usleep(10000);
        for (std::map<int, Client *>::iterator it = this->_clientsServer.begin(); it != this->_clientsServer.end(); it++)
        {
            if (close(it->first) < 0)
                std::cerr << "Error: Server::cleanServer: close client fd fail for fd " << it->first << std::endl;
            std::cout << "client " << it->second->getNickuserhost() << " disconnected successfully on fd " << it->first << std::endl;
            delete it->second;
        }
        for (std::map<std::string, Channel *>::iterator it = this->_channels.begin(); it != this->_channels.end(); it++)
            delete it->second;
        // this->_channels.clear() and this->_clientsServer.clear() clean useless program end
        close(this->_epollpkg._fd_epoll);
        close(this->_fd_socket);
    }
}




void Server::init_socket(void)
{
    t_sockaddr_in addr_bind;

    this->_fd_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (this->_fd_socket < 0)
        throw std::runtime_error("Error: Server::init: socket fail");
    if (fcntl(this->_fd_socket, F_SETFL, O_NONBLOCK) < 0) // set only O_NONBLOCK, not use F_GETFL
    {
        close(this->_fd_socket);
        throw std::runtime_error("Error: Server::init: fcntl O_NONBLOCK fail");
    }
    const int opt_on = 1;
    if (setsockopt(this->_fd_socket, SOL_SOCKET, SO_REUSEADDR, &opt_on, sizeof(opt_on)) < 0)
    {
        close(this->_fd_socket);
        throw std::runtime_error("Error: Server::init: setsockopt fail");
    }
    std::memset(&addr_bind, 0, sizeof(addr_bind));
    addr_bind.sin_family = AF_INET;
    addr_bind.sin_port = htons(this->_port);
    addr_bind.sin_addr.s_addr = htonl(INADDR_ANY);
    if (bind(this->_fd_socket, reinterpret_cast<t_sockaddr *>(&addr_bind), sizeof(addr_bind)) < 0)
    {
        close(this->_fd_socket);
        throw std::runtime_error("Error: Server::init: bind fail");
    }
    if (listen(this->_fd_socket, LISTEN_QUEUED) < 0) // TOSEE SUBJECT Only 1 poll() (or equivalent) can be used for handling all these operations (read, write, but also listen, and so forth)
    {
        close(this->_fd_socket);
        throw std::runtime_error("Error: Server::init: listen fail");
    }
}

void Server::init_sigaction(void)
{
    t_sigaction sig;
    std::memset(&sig, 0, sizeof(sig));
    sigemptyset(&(sig.sa_mask));
    sig.sa_flags = SA_RESTART;
    sig.sa_handler = SIG_IGN;
    if (sigaction(SIGHUP, &(sig), NULL) < 0 || \
        sigaction(SIGUSR1, &(sig), NULL) < 0 || \
        sigaction(SIGUSR2, &(sig), NULL) < 0 || \
        sigaction(SIGPIPE, &(sig), NULL) < 0 || \
        sigaction(SIGALRM, &(sig), NULL) < 0 || \
        sigaction(SIGCHLD, &(sig), NULL) < 0 || \
        sigaction(SIGXFSZ, &(sig), NULL) < 0) // Based on InspIRCd, SIGPIPE and SIGXFSZ are ignored but handle in ft_irc by closing and deleting the client
    {
        close(this->_fd_socket);
        throw std::runtime_error("Error: Server::init: sigaction 1 fail");
    }
    sigfillset(&(sig.sa_mask));
    sig.sa_handler = &Server::SignalHandler;
    if (sigaction(SIGINT, &(sig), NULL) < 0 || \
        sigaction(SIGQUIT, &(sig), NULL) < 0 || \
        sigaction(SIGTERM, &(sig), NULL) < 0)
    {
        close(this->_fd_socket);
        throw std::runtime_error("Error: Server::init: sigaction 2 fail");
    }
}

void Server::init_epoll(void)
{
    std::memset(&(this->_epollpkg), 0, sizeof(this->_epollpkg));
    this->_epollpkg._fd_epoll = epoll_create1(0);
    if (this->_epollpkg._fd_epoll < 0)
    {
        close(this->_epollpkg._fd_epoll);
        close(this->_fd_socket);
        throw std::runtime_error("Error: Server::init: epoll_create1 fail");
    }
    this->_epollpkg._tmp_event.events = EPOLLIN;
    this->_epollpkg._tmp_event.data.fd = this->_fd_socket;
    if (epoll_ctl(this->_epollpkg._fd_epoll, EPOLL_CTL_ADD, this->_fd_socket, &this->_epollpkg._tmp_event) < 0)
    {
        close(this->_epollpkg._fd_epoll);
        close(this->_fd_socket);
        throw std::runtime_error("Error: Server::init: epoll_ctl of the first epoll fd fail");        
    }
}

void Server::init(void)
{
    init_socket();
    init_sigaction();
    init_epoll();
    Server::_staticInitSucess = true;
}




void Server::run_newClient(void)
{
    sockaddr_in tmp_addr_in;
    socklen_t   tmp_addr_len;
    int         tmp_client_fd;

    std::memset(&tmp_addr_in, 0, sizeof(tmp_addr_in));
    tmp_addr_len = sizeof(tmp_addr_in);
    tmp_client_fd = accept(this->_fd_socket, reinterpret_cast<t_sockaddr *>(&tmp_addr_in), &tmp_addr_len);
    if (tmp_client_fd < 0)
        std::cerr << "Error: Server::run_newClient: accept fail" << std::endl;
    else if (fcntl(tmp_client_fd, F_SETFL, O_NONBLOCK) < 0) // set only O_NONBLOCK, not use F_GETFL
    {
        std::cerr << "Error: Server::run_newClient: fcntl O_NONBLOCK fail" << std::endl;
        if (close(tmp_client_fd) < 0)
            std::cerr << "Error: Server::run_newClient: close tmp_client_fd 1 fail" << std::endl;
    }
    else
    {
        std::string tmp_hostname_client(inet_ntoa(tmp_addr_in.sin_addr));
        std::cout << "client " << tmp_hostname_client << " connected on fd " << tmp_client_fd << std::endl;
        std::string tmp_hostname_server;
        std::memset(&tmp_addr_in, 0, sizeof(tmp_addr_in));
        tmp_addr_len = sizeof(tmp_addr_in);
        if (getsockname(tmp_client_fd, reinterpret_cast<sockaddr *>(&tmp_addr_in), &tmp_addr_len) < 0)
        {
            std::cerr << "Error: Server::run_newClient: getsockname failed" << std::endl;
            if (close(tmp_client_fd) < 0)
                std::cerr << "Error: Server::run_newClient: close tmp_client_fd 2 fail" << std::endl;
            return;
        }
        else
        {
            tmp_hostname_server = inet_ntoa(tmp_addr_in.sin_addr);
            tmp_hostname_server += ":" + intToString(this->_port); 
        }
        this->_epollpkg._tmp_event.events = EPOLLIN | EPOLLET; // can use EPOLLET (Edge-Triggered), because the code always read all the data available.
        this->_epollpkg._tmp_event.data.fd = tmp_client_fd;
        if (epoll_ctl(this->_epollpkg._fd_epoll, EPOLL_CTL_ADD, tmp_client_fd, &this->_epollpkg._tmp_event) < 0)
        {
            std::cerr << "Error: Server::run_newClient: EPOLL_CTL_ADD client fd fail" << std::endl;
            if (close(tmp_client_fd) < 0)
                std::cerr << "Error: Server::run_newClient: close tmp_client_fd 3 fail" << std::endl;
            return;
        }
        else
        {
            Client* new_client = new Client(tmp_client_fd, tmp_hostname_client, tmp_hostname_server);
            if (new_client == NULL)
            {
                std::cerr << "Error: Server::run_newClient: new fail" << std::endl;
                if (epoll_ctl(this->_epollpkg._fd_epoll, EPOLL_CTL_DEL, tmp_client_fd, &this->_epollpkg._tmp_event) < 0)
                    std::cerr << "Error: Server::run_newClient: EPOLL_CTL_DEL client fd fail" << std::endl;
                if (close(tmp_client_fd) < 0)
                    std::cerr << "Error: Server::run_newClient: close tmp_client_fd 4 fail" << std::endl;
                return;
            }
            else
                this->_clientsServer[tmp_client_fd] = new_client;
        }
    }
}

void Server::run_existingClient(int const & pEventFd)
{
    char tmp_buffer[BUFFER_SIZE + 1];
    std::string & cmd = this->_clientsServer[pEventFd]->stringBuffer;
    ssize_t bytes_read = -1;

    do
    {
        bytes_read = recv(pEventFd, tmp_buffer, BUFFER_SIZE, 0);
        if (bytes_read < 0)
        {
            std::cerr << "Error: Server::run_existingClient: (recv fail)" << std::endl; 
            disconnectClientFd(pEventFd);
            return;
        }
        else if (bytes_read == 0)
        {
            disconnectClientFd(pEventFd);
            return;
        }
        tmp_buffer[bytes_read] = '\0';
        cmd += tmp_buffer;
        if (cmd.size() > std::numeric_limits<size_t>::max() - BUFFER_SIZE - RECVEXCESSFLOODLIMIT)
        {
            std::cerr << "Error: manageCmd: Excess Flood" << std::endl;
            sendToClientErrorAndDisconnect(*this->_clientsServer[pEventFd], "(Excess Flood)");
            return;
        }
    } while (bytes_read == BUFFER_SIZE);
    if ((cmd.find_first_of("\r\n") == std::string::npos))
        return;
    
    size_t  last_find = 0;
    bool    is_r = false;
    bool    is_disconnected = false;
    for (size_t j = 0; j < cmd.length(); j++)
    {
        if (cmd[j] == '\r' || cmd[j] == '\n')
        {
            if (cmd[j] == '\r')
                is_r = true;
            if (j - 1 == last_find && (cmd[j] == '\r' || cmd[j] == '\n'))
            {
                last_find = j + 1;
                continue;
            }
            is_disconnected = manageCmd(*this, *this->_clientsServer[pEventFd], cmd.substr(last_find, j - last_find));
            if (is_disconnected == true)
                return;
            j++;
            if (is_r == true && j < cmd.length() && cmd[j] == '\n')
            {
                j++;
            }
            last_find = j;
            is_r = false;
        }
    }
    cmd = "";
    return;
}

int Server::run(void)
{
    while (Server::_staticRunning == true)
    {
        this->_epollpkg._tmp_events_count = epoll_wait(this->_epollpkg._fd_epoll, this->_epollpkg._events, MAX_EVENTS, -1);
        if (this->_epollpkg._tmp_events_count < 0)
        {
            std::cerr << "Warning: Server::run: epoll_wait fail, breaking the while loop" << std::endl;
            break;
        }
        for (int event_index = 0; event_index < this->_epollpkg._tmp_events_count; event_index++) // no need to break the for loop in case of run_newClient/run_existingClient fail, because correclty clear
        {
            int const & event_fd = this->_epollpkg._events[event_index].data.fd;
            if (event_fd == this->_fd_socket)
                Server::run_newClient();
            else
                Server::run_existingClient(event_fd);
        }
    }
    return (Server::_staticExitCode);
}




std::string const & Server::getPassword(void) const
{
    return (this->_password);
}

const std::string& Server::getStartDate(void) const {return _startDate;}

std::map<int, Client *> const & Server::getClientsServer(void) const
{
    return (this->_clientsServer);
}

Client * Server::getClientServerByNick(const std::string & pNick)
{
    for (std::map<int, Client *>::iterator it = _clientsServer.begin(); it != _clientsServer.end(); it++)
    {
        if (it->second->getNick() == pNick)
            return (it->second);
    }
    return (NULL);
}

std::map<std::string, Channel *> const & Server::getChannels(void) const {return _channels;}

Channel * Server::getChannelByName(std::string const & pName)
{
    std::map<std::string, Channel *>::iterator it = _channels.find(pName);
    if (it != _channels.end())
        return (it->second);
    return (NULL);
}

Channel * Server::createChannel(std::string const & pName)
{
    Channel *channel = new Channel(pName);
    if (channel == NULL)
        return (NULL);
    _channels[pName] = channel;
    return channel;
}

void Server::removeInvitationFromClientsServer(std::string const & pChannelName)
{
    for (std::map<int, Client *>::iterator it = this->_clientsServer.begin(); it != this->_clientsServer.end(); it++)
        it->second->deleteInvitation(pChannelName);
}

void Server::deleteChannelByName(std::string const & pName)
{
    std::map<std::string, Channel *>::iterator it = _channels.find(pName);
    if (it != _channels.end())
    {
        this->removeInvitationFromClientsServer(it->first);
        delete it->second;
        this->_channels.erase(it);
    }
    else
        std::cerr << "Error/Warning: Server::deleteChannelByName: called but don't exist" << std::endl;
}




void Server::disconnectClientFd(int clientFd)
{
    std::map<int, Client*>::iterator it = _clientsServer.find(clientFd);
    if (it != _clientsServer.end())
    {
        Client* client = it->second;


        std::set<Client*> setClientsLinkedToTarget;
        for (std::map<std::string, Channel *>::iterator it_channel = _channels.begin(); it_channel != _channels.end(); it_channel++)
        {
            Channel * currentChannel = it_channel->second;
            if (currentChannel->isClientPresent(*client) == true)
            {
                std::map<Client *, bool> const & ff = currentChannel->getClientsChannel();
                for (std::map<Client *, bool>::const_iterator it_clients_in_channel = ff.begin(); it_clients_in_channel != ff.end(); it_clients_in_channel++)
                    setClientsLinkedToTarget.insert(it_clients_in_channel->first);
            }
        }
        setClientsLinkedToTarget.erase(client); // to avoid sending to client that disconnect
        for (std::set<Client*>::iterator it_link = setClientsLinkedToTarget.begin(); it_link != setClientsLinkedToTarget.end(); it_link++)
            this->sendToClientFdNoProtection((*it_link)->getFd(), ":" + client->getNickuserhost() + " QUIT :Client Quit", false);
        
        for (std::map<std::string, Channel *>::iterator it_channel = _channels.begin(); it_channel != _channels.end();) // special for, no it_channel++
        {
            std::string const & currentChannel_name = it_channel->first;
            Channel * currentChannel = it_channel->second;
            currentChannel->deleteClientByNick(client->getNick());
            if (currentChannel->getClientCount() == 0)
            {
                this->removeInvitationFromClientsServer(currentChannel_name);
                delete currentChannel;
                this->_channels.erase(it_channel);
                it_channel = _channels.begin(); // not clean but avoid segfault
            }
            else
                it_channel++;
        }
        if (epoll_ctl(this->_epollpkg._fd_epoll, EPOLL_CTL_DEL, clientFd, NULL) < 0)
            std::cerr << "Error: Server::disconnectClientFd: EPOLL_CTL_DEL client fd fail" << std::endl;
        if (close(clientFd) < 0)
            std::cerr << "Error: Server::disconnectClientFd: close client fd fail" << std::endl;
        std::cout << "client " << client->getNickuserhost() << " disconnected successfully on fd " << clientFd << std::endl;
        delete client;
        _clientsServer.erase(it);
    }
    else
        std::cerr << "Error: Server::disconnectClientFd: cannot find the client" << std::endl;
}

bool Server::sendToClientFd(int const & pClientFd, std::string const & pMsg, bool const & pEnableServerPrefix)
{
    std::string message;
    if (pEnableServerPrefix == true)
        message = SERVER_NAME_PREFIX_SPACED + pMsg + "\r\n";
    else
        message = pMsg + "\r\n";
    if (send(pClientFd, message.c_str(), message.length(), 0) < 0)
    {
        this->disconnectClientFd(pClientFd);
        return (true);
    }
    return (false);
}

/* 
    this function is use to send to a client without protecting send and disconnectClientFd,
    use for example : to avoid deleting an '_epollpkg._events' and segfault in the Server::run()
*/
void Server::sendToClientFdNoProtection(int const & pClientFd, std::string const & pMsg, bool const & pEnableServerPrefix)
{
    std::string message;
    if (pEnableServerPrefix == true)
        message = SERVER_NAME_PREFIX_SPACED + pMsg + "\r\n";
    else
        message = pMsg + "\r\n";
    send(pClientFd, message.c_str(), message.length(), 0);
}

bool Server::sendToClientErrorAndDisconnect(Client & pClient, std::string const & pErrorStr)
{
    std::string message = "ERROR :Closing Link: " + pClient.getClientHostname() + " " + pErrorStr;
    send(pClient.getFd(), message.c_str(), message.length(), 0);
    usleep(10000);
    this->disconnectClientFd(pClient.getFd());
    return (true);
}
