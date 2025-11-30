#include "cmd/cmd_register.hpp"

bool cmd_register_invite(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd)
{
    if (pClient.isRegistered() == false)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NOTREGISTERED + " * :You have not registered", true)); // * is not link to nick in irc.libera.chat
    else if (pSplited_cmd.size() < 3) // never happen in hexchat
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NEEDMOREPARAMS + " " + pClient.getNick() + " INVITE :Not enough parameters", true));

    std::string const & target_nick = pSplited_cmd[1];
    Client * target = pServer.getClientServerByNick(target_nick);
    if (target == NULL)
        return (pServer.sendToClientFd(pClient.getFd(), "401 " + pClient.getNick() + " " + target_nick + " :No such nick/channel", true));
    std::string const & target_channel = pSplited_cmd[2];
    Channel * channel_invited = pServer.getChannelByName(target_channel);
    if (channel_invited == NULL)
        return (pServer.sendToClientFd(pClient.getFd(), "403 " + pClient.getNick() + " " + target_channel + " :No such channel", true));
    else if (channel_invited->isClientPresent(pClient) == false)
        return (pServer.sendToClientFd(pClient.getFd(), "442 " + pClient.getNick() + " " + target_channel + " :You're not on that channel", true));
    else if (channel_invited->isClientPresent(*target) == true)
        return (pServer.sendToClientFd(pClient.getFd(), "443 " + pClient.getNick() + " " + target_nick + " " + target_channel + " :is already on channel", true));
    else if (channel_invited->isClientOperator(pClient) == false)
        return (pServer.sendToClientFd(pClient.getFd(), "482 " + pClient.getNick() + " " + target_nick + " " + target_channel + " :You're not a channel operator", true));
    target->addInvitation(target_channel);
    pServer.sendToClientFdNoProtection(target->getFd(), ":" + pClient.getNickuserhost()+ " INVITE " + target_nick + " :" + target_channel, false);
    return (pServer.sendToClientFd(pClient.getFd(), "341 " + pClient.getNick() + " " + target_nick + " " + target_channel, true));
}
