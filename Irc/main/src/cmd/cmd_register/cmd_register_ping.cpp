#include "cmd/cmd_register.hpp"

bool cmd_register_ping(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd)
{
    // do not support 'ERR_NOSUCHSERVER (402)', Deprecated Numeric Reply
    // do not support 'ERR_NOORIGIN (409)' not happen
    if (pClient.isRegistered() == false)
    {
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NOTREGISTERED + " * :You have not registered", true)); // * is not link to nick in irc.libera.chat
    }
    if (pSplited_cmd.size() < 2)
    {
        std::cerr << "Error: cmd_register_ping: Not enough parameters" << std::endl;
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NEEDMOREPARAMS + " " + pClient.getNick() + " PING :Not enough parameters", true));
    }
    return (pServer.sendToClientFd(pClient.getFd(), "PONG " + SERVER_NAME + " :" + pSplited_cmd[1], true));
}
