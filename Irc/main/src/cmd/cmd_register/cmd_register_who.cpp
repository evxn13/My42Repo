#include "cmd/cmd_register.hpp"

bool cmd_register_who(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd)
{
    if (pClient.isRegistered() == false)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NOTREGISTERED + " * :You have not registered", true)); // * is not link to nick in irc.libera.chat
    else if (pSplited_cmd.size() < 2)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NEEDMOREPARAMS + " " + pClient.getNick() + " WHO :Not enough parameters", true));

    
    if (pSplited_cmd[1][0] == '#')
    {
        Channel * channel_find = pServer.getChannelByName(pSplited_cmd[1]);
        if (channel_find != NULL)
        {
            std::map<Client *, bool> const & clients_channel = channel_find->getClientsChannel();
            for (std::map<Client *, bool>::const_iterator it = clients_channel.begin(); it != clients_channel.end(); it++) // FINDALT : here broadcast clientChannel + me
            {
                std::string H_str = channel_find->isClientOperator(*it->first) ? "H@" : "H";
                pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_WHOREPLY + " " + pClient.getNick() + " " + pSplited_cmd[1] + " ~" + it->first->getUser() \
                + " " + it->first->getClientHostname() + " " + SERVER_NAME + " " + it->first->getNick() + " " + H_str + " :0 " + it->first->getRealname(), true);
            }
        }
    }
    else
    {
        for (std::map<int, Client *>::const_iterator it = pServer.getClientsServer().begin(); it != pServer.getClientsServer().end(); it++) // FINDALT : here broadcast clientServer
        {
            Client * tmp_client = it->second;
            if (tmp_client->getNick() == pSplited_cmd[1])
                pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_WHOREPLY + " " + pClient.getNick() + " * ~" + tmp_client->getUser() \
                + " " + tmp_client->getClientHostname() + " " + SERVER_NAME + " " + tmp_client->getNick() + " H :0 " + tmp_client->getRealname(), true);
        }
    }
    return (pServer.sendToClientFd(pClient.getFd(), RPL_ENDOFWHO + " " + pClient.getNick() + " " + pSplited_cmd[1] + " :End of /WHO list.", true));
}
