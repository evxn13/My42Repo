#include "cmd/cmd_handler.hpp"

bool manageCmd(Server & pServer, Client & pClient, std::string const & pCmd)
{
    std::istringstream          iss(pCmd);
    std::vector<std::string>    splited_cmd;
    std::string                 str;

    std::cout << "command receive '" + pCmd + "' from fd " << pClient.getFd() << std::endl;
    if (pCmd.size() > CMD_MAX_SIZE)
    {
        std::cerr << "Error: manageCmd: Input line was too long" << std::endl;
        return (pServer.sendToClientFd(pClient.getFd(), ERR_INPUTTOOLONG + " " + pClient.getNick() + " :Input line was too long", true));
    }
    else if (iss >> str)
    {
        str = stringToUpper(str);
        splited_cmd.push_back(str);
    }
    else
        return (false);
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
    
    if (splited_cmd[0] == "CAP")
        return (cmd_unregister_cap(pServer, pClient, splited_cmd));
    else if (splited_cmd[0] == "QUIT")
        return (cmd_unregister_quit(pServer, pClient));
    else if (splited_cmd[0] == "PASS")
        return (cmd_unregister_pass(pServer, pClient, splited_cmd));
    else if (splited_cmd[0] == "NICK")
        return (cmd_unregister_nick(pServer, pClient, splited_cmd));
    else if (splited_cmd[0] == "USER")
        return (cmd_unregister_user(pServer, pClient, splited_cmd));
    else if (splited_cmd[0] == "JOIN")
        return (cmd_register_join(pServer, pClient, splited_cmd));
    else if (splited_cmd[0] == "KICK")
        return (cmd_register_kick(pServer, pClient, splited_cmd));
    else if (splited_cmd[0] == "INVITE")
        return (cmd_register_invite(pServer, pClient, splited_cmd));
    else if (splited_cmd[0] == "TOPIC")
        return (cmd_register_topic(pServer, pClient, splited_cmd));
    else if (splited_cmd[0] == "NAMES")
        return (cmd_register_names(pServer, pClient, splited_cmd));
    else if (splited_cmd[0] == "PART")
        return (cmd_register_part(pServer, pClient, splited_cmd));
    else if (splited_cmd[0] == "MODE")
        return (cmd_register_mode(pServer, pClient, splited_cmd));
    else if (splited_cmd[0] == "MOTD")
        return (cmd_register_motd(pServer, pClient));
    else if (splited_cmd[0] == "PRIVMSG")
        return (cmd_register_privmsg(pServer, pClient, splited_cmd));
    else if (splited_cmd[0] == "PING")
        return (cmd_register_ping(pServer, pClient, splited_cmd));
    else if (splited_cmd[0] == "WHO")
        return (cmd_register_who(pServer, pClient, splited_cmd));
    else if (pClient.isRegistered() == true)
        return (pServer.sendToClientFd(pClient.getFd(), "421 " + pClient.getNick() + " " + splited_cmd[0] + " :Unknown command", true));
    else
        return (false);
}
