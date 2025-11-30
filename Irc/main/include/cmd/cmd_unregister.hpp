#ifndef CMD_UNREGISTER_HPP
# define CMD_UNREGISTER_HPP

# include <string>
# include <iostream>
# include <sstream>
# include <vector>
# include <algorithm>

# include "class/Server.hpp"
# include "class/Client.hpp"
# include "cmd/cmd_handler.hpp"
# include "cmd/cmd_register.hpp"

class Server;
class Client;

bool cmd_unregister_cap(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd);
bool cmd_unregister_quit(Server & pServer, Client & pClient);
bool cmd_unregister_pass(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd);
bool cmd_unregister_nick(Server & pServer, Client & pClient, std::vector<std::string> const & pSplited_cmd);
bool cmd_unregister_user(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd);

#endif
