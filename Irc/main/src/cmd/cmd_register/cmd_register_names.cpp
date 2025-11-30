#include "cmd/cmd_register.hpp"

static bool cmd_register_names_in_channel(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd, Channel * pChannelTarget)
{
    std::string nicknames;
    std::string actual;
    std::map<Client *, bool> const & clients_in_channel = pChannelTarget->getClientsChannel();
    for (std::map<Client *, bool>::const_iterator it = clients_in_channel.begin(); it != clients_in_channel.end(); it++) // FINDALT : here broadcast clientChannel + me, *can secure me
    {
        if (it->second == true)
            actual = "@" + it->first->getNick() + " ";
        else
            actual = it->first->getNick() + " ";
        if (SERVER_NAME_PREFIX_SPACED.length() + nicknames.length() + actual.length() + CMD_SECURITY_SIZE > CMD_MAX_SIZE) // CMD_SECURITY_SIZE to be safe
        {
            nicknames += actual.substr(0, actual.size() - 1);
            if (pServer.sendToClientFd(pClient.getFd(), RPL_NAMREPLY + " " + pClient.getNick() + " @ " + pSplited_cmd[1] + " :" + nicknames, true) == true) // all channels are consider secret
                return (true);
            nicknames.clear();
        }
        else
            nicknames += actual;
    }
    if (nicknames.empty() == false && pServer.sendToClientFd(pClient.getFd(), RPL_NAMREPLY + " " + pClient.getNick() + " @ " + pSplited_cmd[1] + " :" + nicknames.substr(0, nicknames.size() - 1), true) == true) 
        return (true); 
    return (false);
}

// cmd_register_names called by cmd_register_join
bool cmd_register_names(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd)
{
    if (pClient.isRegistered() == false)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NOTREGISTERED + " * :You have not registered", true)); // * is not link to nick in irc.libera.chat
    else if (pSplited_cmd.size() < 2) // never used ?
    {
        std::map<std::string, Channel *> const & channel_in_server = pServer.getChannels();
        for (std::map<std::string, Channel *>::const_iterator it = channel_in_server.begin(); it != channel_in_server.end(); it++) // FINDALT : here broadcast channel
        {
            if (cmd_register_names_in_channel(pServer, pClient, pSplited_cmd, it->second) == true)
                return (true);
        }
        return (pServer.sendToClientFd(pClient.getFd(), RPL_ENDOFNAMES + " " + pClient.getNick() + " * :End of /NAMES list.", true));
    }
    Channel * channel = pServer.getChannelByName(pSplited_cmd[1]);
    if (channel != NULL && cmd_register_names_in_channel(pServer, pClient, pSplited_cmd, channel) == true) // if null just end of /NAMES
        return (true);
    return (pServer.sendToClientFd(pClient.getFd(), RPL_ENDOFNAMES + " " + pClient.getNick() + " " + pSplited_cmd[1] + " :End of /NAMES list.", true));
}
