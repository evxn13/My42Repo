#include "cmd/cmd_register.hpp"

bool cmd_register_part(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd)
{
    if (pClient.isRegistered() == false)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NOTREGISTERED + " * :You have not registered", true)); // * is not link to nick in irc.libera.chat
    else if (pSplited_cmd.size() < 3) // cannot happen in hexchat
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NEEDMOREPARAMS + " " + pClient.getNick() + " PART :Not enough parameters", true));
    std::string const & reason = pSplited_cmd[2];
    Channel * channel = pServer.getChannelByName(pSplited_cmd[1]);
    if (channel == NULL)
        return (pServer.sendToClientFd(pClient.getFd(), "403 " + pClient.getNick() + " " + pSplited_cmd[1] + " :No such channel", true));
    else if (channel->isClientPresent(pClient) == false)
        return (pServer.sendToClientFd(pClient.getFd(), "442 " + pClient.getNick() + " " + pSplited_cmd[1] + " :You're not on that channel", true));
    std::map<Client *, bool> const & clients_channel = channel->getClientsChannel();
    for (std::map<Client *, bool>::const_iterator it = clients_channel.begin(); it != clients_channel.end(); it++)
        pServer.sendToClientFdNoProtection(it->first->getFd(), ":" + pClient.getNickuserhost()+ " PART " + pSplited_cmd[1] + " :" + reason, false);  // FINDALT : here broadcast clientChannel + me, *can secure me
    channel->removeClient(pClient);
    if (channel->getClientCount() == 0)
        pServer.deleteChannelByName(pSplited_cmd[1]);
    return (false);
}
