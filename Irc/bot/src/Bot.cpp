#include "Bot.hpp"

bool Bot::_staticInitSucess = false;
bool Bot::_staticRunning = true;
int Bot::_staticExitCode = 0;

void Bot::SignalHandler(int pSignal) // static function
{
    Bot::_staticRunning = false;
    if (pSignal == SIGINT || pSignal == SIGTERM)
        Bot::_staticExitCode = 0;
    else
        Bot::_staticExitCode = 128 + pSignal;
}



Bot::Bot(std::string const & pIPV4, int const & pPort, std::string const & pPassword) 
: _ipv4(pIPV4), _port(pPort), _password(pPassword)
{
}

Bot::~Bot(void)
{
    if (Bot::_staticInitSucess == true)
    {
        for (std::map<int, t_ssl_package>::iterator it_bots = this->_bots.begin(); it_bots != this->_bots.end(); it_bots++)
            disconnectDeleteBot(it_bots);
        SSL_CTX_free(this->_ctx);
        ERR_free_strings(); // still reachable block added ERR_free_strings() to pass from ~54000bytes to ~10000bytes, the rest is due to dynamic linker of libs openssl
        close(this->_epollpkg._fd_epoll);
        close(this->_fd_socket);
        std::cout << "Bot::~Bot: Bot destructor called succefully" << std::endl;
    }
    else
        std::cout << "Bot::~Bot: Bot destructor fail to init" << std::endl; // doublon avec le throw du main
}


void Bot::init_socket(void)
{
    t_sockaddr_in   addr_bind;
    int             attempt = 0;

    this->_fd_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (this->_fd_socket < 0)
        throw std::runtime_error("Error: Bot::init: socket fail");
    if (fcntl(this->_fd_socket, F_SETFL, O_NONBLOCK) < 0) // set only O_NONBLOCK, not use F_GETFL
    {
        close(this->_fd_socket);
        throw std::runtime_error("Error: Bot::init: fcntl O_NONBLOCK fail");
    }
    const int opt_on = 1;
    if (setsockopt(this->_fd_socket, SOL_SOCKET, SO_REUSEADDR, &opt_on, sizeof(opt_on)) < 0)
    {
        close(this->_fd_socket);
        throw std::runtime_error("Error: Bot::init: setsockopt fail");
    }
    std::memset(&addr_bind, 0, sizeof(addr_bind));
    addr_bind.sin_family = AF_INET;
    addr_bind.sin_port = htons(this->_port);
    addr_bind.sin_addr.s_addr = inet_addr(this->_ipv4.c_str());
    if (addr_bind.sin_addr.s_addr == INADDR_NONE) 
    {
        close(this->_fd_socket);
        throw std::runtime_error("Error: Bot::init: invalid address");
    }
    while (true)
    {
        if (connect(this->_fd_socket, reinterpret_cast<t_sockaddr *>(&addr_bind), sizeof(addr_bind)) < 0)
        {
            attempt++;
            if (attempt > MAX_ATTEMPT)
                throw std::runtime_error("Error: Bot::init: connect fail");
            else if (errno == EINPROGRESS)
                std::cerr << "Warning: Bot::init: Failed to call connect, EINPROGRESS errno, attempt = " << attempt << std::endl;
            else
                std::cerr << "Error: Bot::init: Failed to call connect, UNKNOWN errno, attempt = " << attempt << std::endl;
            usleep(1000); // wait 1ms and retry
        }
        else
            break;
    }
}

void Bot::init_sigaction(void)
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
        throw std::runtime_error("Error: Bot::init: sigaction 1 fail");
    }
    sigfillset(&(sig.sa_mask));
    sig.sa_handler = &Bot::SignalHandler;
    if (sigaction(SIGINT, &(sig), NULL) < 0 || \
        sigaction(SIGQUIT, &(sig), NULL) < 0 || \
        sigaction(SIGTERM, &(sig), NULL) < 0)
    {
        close(this->_fd_socket);
        throw std::runtime_error("Error: Bot::init: sigaction 2 fail");
    }
}

void Bot::init_epoll(void)
{
    std::memset(&(this->_epollpkg), 0, sizeof(this->_epollpkg));
    this->_epollpkg._fd_epoll = epoll_create1(0);
    if (this->_epollpkg._fd_epoll < 0)
    {
        close(this->_epollpkg._fd_epoll);
        close(this->_fd_socket);
        throw std::runtime_error("Error: Bot::init: epoll_create1 fail");
    }
    this->_epollpkg._tmp_event.events = EPOLLIN;
    this->_epollpkg._tmp_event.data.fd = this->_fd_socket;
    if (epoll_ctl(this->_epollpkg._fd_epoll, EPOLL_CTL_ADD, this->_fd_socket, &this->_epollpkg._tmp_event) < 0)
    {
        close(this->_epollpkg._fd_epoll);
        close(this->_fd_socket);
        throw std::runtime_error("Error: Bot::init: epoll_ctl of the first epoll fd fail");        
    }
}

void Bot::init_botSSL(void)
{
    this->_ctx = NULL;
    this->_ctx = SSL_CTX_new(TLS_client_method());
    if (this->_ctx == NULL)
        throw std::runtime_error("Bot::init_botSSL: Error: Failed to create SSL_CTX");
    if (SSL_CTX_set_min_proto_version(this->_ctx , TLS1_2_VERSION) == 0)
        throw std::runtime_error("Bot::init_botSSL: Error: Failed to set min proto to SSL_CTX");
    SSL_CTX_set_verify(this->_ctx, SSL_VERIFY_PEER, NULL);
    if (SSL_CTX_load_verify_locations(this->_ctx, BOT_SSLCACERT.c_str(), NULL) == 0)
    {
        std::cerr << "Bot::init_botSSL: Error: " << ERR_error_string(ERR_get_error(), NULL) << std::endl;
        throw std::runtime_error("Bot::init_botSSL: Error: Failed to load CA bundle to SSL_CTX");
    }
    // if (SSL_CTX_set_default_verify_paths(this->_ctx) == 0) // don't work at school BOT_SSLCACERT get from online source see (INFO.TXT)
    //     throw std::runtime_error("Bot::init_botSSL: Error: Failed to set defaults CA to SSL_CTX");
}

void Bot::init(void)
{
    init_socket();
    init_sigaction();
    init_epoll();
    init_botSSL();
    this->sendToServerNoProtection("PASS " + this->_password + "\r\nNICK " + BOT_NICK + "\r\nUSER " + BOT_USERNAME + " 0 * : baba tpmp\r\n");
    Bot::_staticInitSucess = true;
}

void Bot::manageCmd(std::string const & pCmd)
{
    std::istringstream          iss(pCmd);
    std::vector<std::string>    splited_cmd;
    std::string                 str;

    std::cout << "command receive '" + pCmd + "' from server " << std::endl;
    if (pCmd.size() > CMD_MAX_SIZE)
    {
        std::cerr << "Warning: Bot::manageCmd: Input line was too long" << std::endl;
        return ;
    }
    else if (iss >> str)
    {
        splited_cmd.push_back(str);
    }
    else
        return;
    while (iss >> str)
    {
        if (str[0] == ':')
        {
            std::string tmp;
            std::getline(iss, tmp);
            tmp = str.substr(1) + tmp;
            if (tmp.empty() == false)
                splited_cmd.push_back(tmp);
            break;
        }
        else
            splited_cmd.push_back(str);
    }
    if (splited_cmd.size() > 1)
    {
        if (splited_cmd[1] == ERR_NICKNAMEINUSE)
        {
            std::cerr << "Error: manageCmd: bot nick in use" << std::endl;
            _staticRunning = false;
            return;
        }
        else if (splited_cmd[1] == "PRIVMSG") // consider PRIVMSG from server safe
        {
            size_t startNick = splited_cmd[0].find(':') + 1;
            size_t endNick = splited_cmd[0].find('!', startNick);
            std::string clientTarget = splited_cmd[0].substr(startNick, endNick - startNick);
            sendToBotPartialProtection(clientTarget, splited_cmd[3]);
        }
    }
}


void Bot::run_server(void)
{
    char tmp_buffer[BUFFER_SIZE + 1];
    static std::string cmd;
    ssize_t bytes_read = -1;

    do
    {
        bytes_read = recv(this->_fd_socket, tmp_buffer, BUFFER_SIZE, 0);
        if (bytes_read < 0)
        {
            std::cerr << "Error: Bot::run_existingClient: (recv fail)" << std::endl;
            _staticRunning = false;
            return;
        }
        else if (bytes_read == 0)
        {
            _staticRunning = false;
            return;
        }
        tmp_buffer[bytes_read] = '\0';
        cmd += tmp_buffer;
        if (cmd.size() > std::numeric_limits<size_t>::max() - BUFFER_SIZE - RECVEXCESSFLOODLIMIT)
        {
            std::cerr << "Error: manageCmd: Excess Flood" << std::endl;
            _staticRunning = false;
            return;
        }
    } while (bytes_read == BUFFER_SIZE);
    if ((cmd.find_first_of("\r\n") == std::string::npos))
        return;
    
    size_t  last_find = 0;
    bool    is_r = false;
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
            this->manageCmd(cmd.substr(last_find, j - last_find));
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

// bonus
static int handle_io_failure(SSL *ssl, int res)
{
    switch (SSL_get_error(ssl, res))
    {
        case SSL_ERROR_WANT_READ:
            // Temporary failure. Wait until we can read and try again
            return 1;
        case SSL_ERROR_WANT_WRITE:
            // Temporary failure. Wait until we can write and try again
            return 1;
        case SSL_ERROR_ZERO_RETURN:
            // EOF
            return 0;
        case SSL_ERROR_SSL:
            // If the failure is due to a verification error we can get more
            // information about it from SSL_get_verify_result().
            if (SSL_get_verify_result(ssl) != X509_V_OK)
            {
                std::cerr << "Verify error: " \
                << X509_verify_cert_error_string(SSL_get_verify_result(ssl)) \
                << std::endl;
            }
            return -1;
        default: // SSL_ERROR_SYSCALL, etc...
            std::cerr << "default error" << std::endl;
            return -1;
    }
}

static std::string extract_json_content(const std::string& pReiceive)
{
    std::string::size_type json_start = pReiceive.find("\r\n\r\n");
    if (json_start == std::string::npos)
    {
        std::cerr << "Error: Bot:extract_json_content: double rn found" << std::endl;
        return ("");
    }
    json_start += 4; // skip "\r\n\r\n"

    std::string json_part = pReiceive.substr(json_start);
    std::string content_key = "\"content\":\"";
    std::string::size_type content_start = json_part.find(content_key);
    if (content_start == std::string::npos)
    {
        std::cerr << "Error: Bot:extract_json_content: no content found" << std::endl;
        return (""); // No content field found
    }
    content_start += content_key.length();

    // Find the closing quote of the content value
    std::string::size_type content_end = json_part.find("\",", content_start);
    if (content_end == std::string::npos)
    {
        std::cerr << "Error: Bot:extract_json_content: Malformed content field" << std::endl;
        return (json_part.substr(content_start)); // Malformed content field take the truncatenate content
    }

    return (json_part.substr(content_start, content_end - content_start));
}

std::vector<std::string> best_split(const std::string& pResponse)
{
    std::vector<std::string> output;
    std::string temp;
    std::string::const_iterator it = pResponse.begin();

    while (it != pResponse.end()) 
    {
        if (*it == '\\' && *(it + 1) == 'n') 
        {
            if (temp.empty() == false) 
            {
                output.push_back(temp);
                temp.clear();
            }
            while (it != pResponse.end() && (*it == '\\' && *(it + 1) == 'n')) 
            {
                output.push_back("");
                it += 2;
            }
            if (it == pResponse.end()) 
                return output;
        } 
        else 
        {
            temp += *it;
            if (temp.length() > BOT_MAXRESPONDESIZE) 
            {
                size_t i_space = 0;
                std::string temp_space("");
                while (i_space < BOT_RESPONDSPACEMARGIN)
                {
                    i_space++;
                    if ((it + i_space) == pResponse.end())
                    {
                        output.push_back(temp + temp_space);
                        return output;
                    }
                    else if (*(it + i_space) == ' ')
                        break;
                    temp_space += *(it + i_space);
                } // this can lose a space at trading but normally no segfault
                temp += temp_space;
                it += i_space;
                if (it == pResponse.end())
                {
                    output.push_back(temp);
                    return output;
                }
                output.push_back(temp);
                temp.clear();
            }
            it++;
        }
    }
    if (temp.empty() == false)
        output.push_back(temp);
    return (output);
}


void Bot::run_Bot(std::map<int, t_ssl_package>::iterator pBotIt)
{
    char        tmp_buffer[BUFFER_SIZE + 1];
    std::string receive("");
    std::string response;
    size_t      bytes_read;
    int         ret_value, ret_io_failure, attempt;

    attempt = 0;
    while (true)
    {
        bytes_read = 0;
        ret_value = SSL_read_ex(pBotIt->second.ssl, tmp_buffer, BUFFER_SIZE, &bytes_read);
        tmp_buffer[bytes_read] = '\0';
        if (ret_value == 1)
            receive += tmp_buffer;
        else
        {
            attempt++;
            ret_io_failure = handle_io_failure(pBotIt->second.ssl, ret_value); // so if handle_io_failure == 1 retry until attempt > MAX_ATTEMPT
            if (ret_io_failure == 0)
                break; // EOF
            else if (ret_io_failure < 0 || attempt > MAX_ATTEMPT) // if ret_io_failure < 0, it's a fatal error
            {
                std::cerr << "Error: Bot::run_bot: Failed to call SSL_read_ex, attempt = " << attempt << std::endl;
                break;
            }
        }
        usleep(1000); // wait 1ms and retry
    }
    response = extract_json_content(receive);
    if (response.empty() == true)
    {
        std::cerr << "Error: Bot::run_bot: Failed to read the json response, old attempt = " << attempt << std::endl;
        this->sendToServerNoProtection("PRIVMSG " + pBotIt->second.clientName + " :\002Fail to read the json response\002");
    }
    else
    {
        std::vector<std::string> part = best_split(response);
        for (std::vector<std::string>::iterator i = part.begin(); i != part.end(); i++)
            this->sendToServerNoProtection("PRIVMSG " + pBotIt->second.clientName + " :\002" + *i + "\002");
    }
    disconnectDeleteBot(pBotIt);
}

int Bot::run(void)
{
    while (Bot::_staticRunning == true)
    {
        this->_epollpkg._tmp_events_count = epoll_wait(this->_epollpkg._fd_epoll, this->_epollpkg._events, MAX_EVENTS, -1);
        if (this->_epollpkg._tmp_events_count < 0)
        {
            std::cerr << "Warning: Bot::run: epoll_wait fail, breaking the while loop" << std::endl;
            break;
        }
        for (int event_index = 0; event_index < this->_epollpkg._tmp_events_count; event_index++) // no need to break the for loop in case of run_server/run_Bot fail, because correclty clear
        {
            int const & event_fd = this->_epollpkg._events[event_index].data.fd;
            if (event_fd == this->_fd_socket)
                Bot::run_server();
            else
            {
                std::map<int, t_ssl_package>::iterator it = this->_bots.find(event_fd); 
                if (it != this->_bots.end())
                    Bot::run_Bot(it);
                else
                {
                    std::cerr << "Error: Bot::run: unknow epoll event" << std::endl;
                    return (Bot::_staticExitCode);
                }
            }
        }
    }
    return (Bot::_staticExitCode);
}

/* 
    this function is use to send to a client without protecting send and disconnectServer,
    use for example : to avoid deleting an '_epollpkg._events' and segfault in the Bot::run()
*/
void Bot::sendToServerNoProtection(std::string const & pMsg)
{
    std::string message = pMsg + "\r\n";
    send(this->_fd_socket, message.c_str(), message.length(), 0);
}

static std::string createPostRequest(std::string const & pMsg) {
    std::string prompt;
    prompt += "{\n";
    prompt += "    \"model\": \"mistral-small-latest\",\n";
    prompt += "    \"messages\": [\n";
    prompt += "        {\n";
    prompt += "            \"role\": \"user\",\n";
    prompt += "            \"content\": \"" + pMsg + "\"\n";
    prompt += "        }\n";
    prompt += "    ],\n";
    prompt += "    \"temperature\": 0.7,\n";
    prompt += "    \"top_p\": 1,\n";
    prompt += "    \"max_tokens\": 16000,\n"; // 32k for mistral small max
    prompt += "    \"stream\": false,\n";
    prompt += "    \"safe_prompt\": false,\n";
    prompt += "    \"random_seed\": 42\n";
    prompt += "}\n";

    std::string request = "POST /v1/chat/completions HTTP/1.1\r\n";
    request += "Host: " + BOT_APIURL + "\r\n"; 
    request += "Authorization: Bearer " + BOT_APIKEY + "\r\n";
    request += "Content-Type: application/json\r\n";
    request += "User-Agent: MyHttpClient\r\n";
    request += "Connection: close\r\n";
    request += "Content-Length: " + intToString(prompt.size()) + "\r\n";
    request += "\r\n";
    request += prompt;
    
    return request;
}

/* 
    this function is use to send to mistral server with protection,
    but no protection when sending to IRC server, so PartialProtection
*/
void Bot::sendToBotPartialProtection(std::string const & pClientTargetName, std::string const & pMsg)
{
    int bot_fd, ret_value, attempt;
    std::map<int, t_ssl_package>::iterator bot_map_it;
    std::string request;
    size_t bytes_write;

    for (std::map<int, t_ssl_package>::iterator it = this->_bots.begin(); it != this->_bots.end(); it++)
    {
        if (pClientTargetName == it->second.clientName)
        {
            this->sendToServerNoProtection("PRIVMSG " + pClientTargetName + " :\002Still pending a response\002");
            return;
        }
    }
    bot_fd = createBot(pClientTargetName);
    if (bot_fd == -1)
    {
        this->sendToServerNoProtection("PRIVMSG " + pClientTargetName + " :\002Fail to create an SSL communication\002");
        return;
    }
    bot_map_it = this->_bots.find(bot_fd);
    request = createPostRequest(pMsg);
    attempt = 0;
    while (true) // it's kind of a blocking function, if want to avoid it should use thread/process, mutex, etc...
    {
        attempt++;
        ret_value = SSL_write_ex(bot_map_it->second.ssl, request.c_str(), request.length(), &bytes_write);
        if (ret_value == 1)
            break; // sucess
        if (handle_io_failure(bot_map_it->second.ssl, ret_value) != 1 || attempt > MAX_ATTEMPT) // fatal fail 
        {
            std::cerr << "Error: Bot::sendToBot: Failed to write the post request, attempt = " << attempt << std::endl;
            disconnectDeleteBot(bot_map_it);
            this->sendToServerNoProtection("PRIVMSG " + pClientTargetName + " :\002Fail to write the post request\002");
            return;
        }
        usleep(1000); // wait 1ms and retry
    }
}

int Bot::createBot(std::string const & pClientTargetName)
{
    int fd, ret_value, attempt;
    t_ssl_package sslpgk;
    struct addrinfo hints, *res, *p; // res/p are linked_list

    sslpgk.clientName = pClientTargetName;
    sslpgk.ssl = SSL_new(this->_ctx);
    if (sslpgk.ssl == NULL)
    {
        std::cerr << "Error: Bot::createBot: Failed to create SSL" << std::endl;
        return (-1);
    }
    std::memset(&hints, 0, sizeof(hints));
    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;
    if (getaddrinfo(BOT_APIURL.c_str(), "443", &hints, &res) != 0)
    {
        std::cerr << "Error: Bot::createBot: Fail to call getaddrinfo" << std::endl;
        SSL_free(sslpgk.ssl);
        return (-1);
    }
    for (p = res; p != NULL; p = p->ai_next)
    {
        fd = socket(AF_INET, SOCK_STREAM, 0);
        if (fd == -1)
            continue;
        if (connect(fd, p->ai_addr, p->ai_addrlen) != 0)
        {
            close(fd);
            fd = -1;
            continue;
        }
        if (fcntl(fd, F_SETFL, O_NONBLOCK) < 0)
        {
            std::cerr << "Error: Bot::createBot: Fail to call fcntl" << std::endl;
            close(fd);
            fd = -1;
            continue;
        }
        const int opt_on = 1;
        if (setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &opt_on, sizeof(opt_on)) < 0) // no need SO_REUSEPORT ?
        {
            std::cerr << "Error: Bot::createBot: Fail to call setsockopt" << std::endl;
            close(fd);
            fd = -1;
            continue;
        }
        break;
    }
    freeaddrinfo(res);
    if (fd == -1)
    {
        std::cerr << "Error: Bot::createBot: cannot find a connection" << std::endl;
        SSL_free(sslpgk.ssl);
        return (-1);
    }
    sslpgk.bio = BIO_new(BIO_s_socket());
    if (sslpgk.bio == NULL)
    {
        std::cerr << "Error: Bot::createBot: Fail to call BIO_new" << std::endl;
        close(fd);
        SSL_free(sslpgk.ssl);
        return (-1);
    }
    BIO_set_fd(sslpgk.bio, fd, BIO_CLOSE); // when finish we bio auto-close fd
    SSL_set_bio(sslpgk.ssl, sslpgk.bio, sslpgk.bio); // when finish we ssl auto-close bio, two time bio because read/write can be diff
    if (SSL_set1_host(sslpgk.ssl, BOT_APIURL.c_str()) == 0)
    {
        std::cerr << "Error: Bot::createBot: Fail to call SSL_set1_host" << std::endl;
        SSL_free(sslpgk.ssl);
        return (-1);
    }
    else if (SSL_set_tlsext_host_name(sslpgk.ssl, BOT_APIURL.c_str()) == 0)
    {
        std::cerr << "Error: Bot::createBot: Fail to call SSL_set_tlsext_host_name" << std::endl;
        SSL_free(sslpgk.ssl);
        return (-1);
    }
    attempt = 0;
    while (true) // it's kind of a blocking function, if want to avoid it should use thread/process
    {
        attempt++;
        ret_value = SSL_connect(sslpgk.ssl);
        if (ret_value == 1)
            break; // sucess
        if (handle_io_failure(sslpgk.ssl, ret_value) != 1 || attempt > MAX_ATTEMPT) // fatal fail 
        {
            std::cerr << "Error: Bot::createBot: Failed to connect to Bot, attempt = " << attempt << std::endl;
            SSL_free(sslpgk.ssl);
            return (-1);
        }
        usleep(1000); // wait 1ms and retry
    }
    this->_epollpkg._tmp_event.events = EPOLLIN; // only EPOLLIN because it can fail when read
    this->_epollpkg._tmp_event.data.fd = fd;
    if (epoll_ctl(this->_epollpkg._fd_epoll, EPOLL_CTL_ADD, fd, &this->_epollpkg._tmp_event) < 0)
    {
        std::cerr << "Error: Bot::createBot: EPOLL_CTL_ADD bot fd fail" << std::endl;
        SSL_free(sslpgk.ssl);
        return (-1);
    }
    this->_bots[fd] = sslpgk; // not the best, can use insert...
    return (fd);
}

 void Bot::disconnectDeleteBot(std::map<int, t_ssl_package>::iterator pBotIt)
 {
    int ret_value, attempt;

    if (epoll_ctl(this->_epollpkg._fd_epoll, EPOLL_CTL_DEL, pBotIt->first, NULL) < 0)
        std::cerr << "Error: Bot::disconnectDeleteBot: EPOLL_CTL_DEL bot fd fail" << std::endl;
    attempt = 0;
    while (true) // it's kind of a blocking function, if want to avoid it should use thread/process
    {
        attempt++;
        ret_value = SSL_shutdown(pBotIt->second.ssl);
        // ret_value == 0 is unexpected here because that means "we've sent a
        // close_notify and we're waiting for one back". But we already know
        // we got one from the peer because of the SSL_ERROR_ZERO_RETURN
        // (i.e. EOF) above.
        if (ret_value >= 0) // can be 0 but we don't care ?
            break; // sucess
        if (handle_io_failure(pBotIt->second.ssl, ret_value) != 1 || attempt > MAX_ATTEMPT) // fatal fail 
        {
            std::cerr << "Error: Bot::disconnectDeleteBot: Failed to shutting down, attempt = " << attempt << std::endl;
            SSL_free(pBotIt->second.ssl);
            this->_bots.erase(pBotIt);
        }
        usleep(1000); // wait 1ms and retry
    }
    SSL_free(pBotIt->second.ssl); // should free bio and fd, because ownership of them was immediately transferred to the SSL object
    std::cout << "bot disconnected successfully on fd " << pBotIt->first << std::endl;
    this->_bots.erase(pBotIt);
 }
