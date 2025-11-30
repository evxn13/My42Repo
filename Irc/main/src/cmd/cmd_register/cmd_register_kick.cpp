#include "cmd/cmd_register.hpp"

bool cmd_register_kick(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd)
{
    if (pClient.isRegistered() == false)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NOTREGISTERED + " * :You have not registered", true)); // * is not link to nick in irc.libera.chat
    else if (pSplited_cmd.size() < 3) // never happen in hexchat
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NEEDMOREPARAMS + " " + pClient.getNick() + " KICK :Not enough parameters", true));

    std::string const & channel_name = pSplited_cmd[1];
    Channel * channel = pServer.getChannelByName(channel_name);
    if (channel == NULL)
        return (pServer.sendToClientFd(pClient.getFd(), "403 " + pClient.getNick() + " " + channel_name + " :No such channel", true));
    else if (channel->isClientPresent(pClient) == false) 
        return (pServer.sendToClientFd(pClient.getFd(), "482 " + pClient.getNick() + " " + channel_name + " :You're not a channel operator", true)); // could be 442, not in irc.liberachat
    else if (channel->isClientOperator(pClient) == false)
        return (pServer.sendToClientFd(pClient.getFd(), "482 " + pClient.getNick() + " " + channel_name + " :You're not a channel operator", true));
    std::string const & target_to_kick = pSplited_cmd[2];
    Client * target = channel->getClientChannelByNick(target_to_kick);
    if (target == NULL)
        return (pServer.sendToClientFd(pClient.getFd(), "401 " + pClient.getNick() + " " + target_to_kick + " :No such nick/channel", true));
    else if (pSplited_cmd.size() > 3)
    {
        std::string const & reason = pSplited_cmd[3];
        std::map<Client *, bool> const & clients_channel = channel->getClientsChannel();
        for (std::map<Client *, bool>::const_iterator it = clients_channel.begin(); it != clients_channel.end(); it++)
            pServer.sendToClientFdNoProtection(it->first->getFd(), ":" + pClient.getNickuserhost()+ " KICK " + channel_name + " " + target_to_kick + " :" + reason, false); // FINDALT : here broadcast clientChannel + me, *can secure me
        channel->removeClient(*target);
    }
    else
    {
        std::map<Client *, bool> const & clients_channel = channel->getClientsChannel();
        for (std::map<Client *, bool>::const_iterator it = clients_channel.begin(); it != clients_channel.end(); it++)
            pServer.sendToClientFdNoProtection(it->first->getFd(), ":" + pClient.getNickuserhost()+ " KICK " + channel_name + " " + target_to_kick + " :" + target_to_kick, false); // FINDALT : here broadcast clientChannel + me, *can secure me
        channel->removeClient(*target);
    }
    return (false);
}
