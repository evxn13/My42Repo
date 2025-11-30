#include "cmd/cmd_register.hpp"

bool cmd_register_privmsg(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd)
{
    if (pClient.isRegistered() == false)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NOTREGISTERED + " * :You have not registered", true)); // * is not link to nick in irc.libera.chat
    else if (pSplited_cmd.size() < 2)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NEEDMOREPARAMS + " " + pClient.getNick() + " PRIVMSG :Not enough parameters", true));
    else if (pSplited_cmd.size() < 3)
        return (pServer.sendToClientFd(pClient.getFd(), "412 " + pClient.getNick() + " :No text to send", true));

    std::set<std::string> privmsgTargetSet = splitToSet(pSplited_cmd[1], ',');
    for (std::set<std::string>::const_iterator itTarget = privmsgTargetSet.begin(); itTarget != privmsgTargetSet.end(); itTarget++)
    {
        if ((*itTarget)[0] == '#')
        {
            Channel * channel_find = pServer.getChannelByName(*itTarget);
            if (channel_find == NULL)
            {
                pServer.sendToClientFdNoProtection(pClient.getFd(), "401 " + pClient.getNick() + " " + *itTarget + " :No such nick/channel", true);
                continue;
            }
            else if (channel_find->isClientPresent(pClient) == false)
            {
                pServer.sendToClientFdNoProtection(pClient.getFd(), "404 " + pClient.getNick() + " " + *itTarget + " :Cannot send to nick/channel", true);
                continue;
            }
            std::map<Client *, bool> const & clients_channel = channel_find->getClientsChannel();
            for (std::map<Client *, bool>::const_iterator it = clients_channel.begin(); it != clients_channel.end(); it++) // FINDALT : here broadcast clientChannel except me
            {
                if (it->first != &pClient)
                    pServer.sendToClientFdNoProtection(it->first->getFd(), ":" + pClient.getNickuserhost()+ " PRIVMSG " + *itTarget + " :" + pSplited_cmd[2], false);
            }
        }
        else
        {
            bool find_target = false;
            for (std::map<int, Client *>::const_iterator it = pServer.getClientsServer().begin(); it != pServer.getClientsServer().end(); it++) // FINDALT : here broadcast clientServer
            {
                Client * tmp_client = it->second;
                if (tmp_client->getNick() == *itTarget)
                {
                    pServer.sendToClientFdNoProtection(it->first, ":" + pClient.getNickuserhost()+ " PRIVMSG " + *itTarget + " :" + pSplited_cmd[2], false);
                    find_target = true;
                    break;
                }
            }
            if (find_target == false)
                pServer.sendToClientFdNoProtection(pClient.getFd(), "401 " + pClient.getNick() + " " + *itTarget + " :No such nick/channel", true);
        }
    }
    return (false);
}
