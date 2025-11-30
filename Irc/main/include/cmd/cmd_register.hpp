#ifndef CMD_REGISTER_HPP
# define CMD_REGISTER_HPP

# include <string>
# include <iostream>
# include <sstream>
# include <vector>
# include <algorithm>
# include <limits>

# include "class/Server.hpp"
# include "class/Client.hpp"
# include "cmd/cmd_handler.hpp"
# include "utils.hpp"

class Server;
class Client;

const int   MAX_OMODE = 3; // rfc1459 set max [+/-]o change to 3 per /MODE

bool cmd_register_join(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd);
bool cmd_register_kick(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd);
bool cmd_register_invite(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd);
bool cmd_register_topic(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd);
bool cmd_register_names(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd);
bool cmd_register_part(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd);
bool cmd_register_mode(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd);
bool cmd_register_motd(Server & pServer, Client & pClient);
bool cmd_register_privmsg(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd);
bool cmd_register_ping(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd);
bool cmd_register_who(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd);

#endif
