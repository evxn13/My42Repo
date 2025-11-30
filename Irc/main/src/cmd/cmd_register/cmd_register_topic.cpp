#include "cmd/cmd_register.hpp"

bool cmd_register_topic(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd)
{
    if (pClient.isRegistered() == false)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NOTREGISTERED + " * :You have not registered", true)); // * is not link to nick in irc.libera.chat
    else if (pSplited_cmd.size() < 2)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NEEDMOREPARAMS + " " + pClient.getNick() + " TOPIC :Not enough parameters", true));

    Channel * channel = pServer.getChannelByName(pSplited_cmd[1]);
    if (channel == NULL)
        return (pServer.sendToClientFd(pClient.getFd(), "403 " + pClient.getNick() + " " + pSplited_cmd[1] + " :No such channel.", true));
    else if (channel->isClientPresent(pClient) == false)
        return (pServer.sendToClientFd(pClient.getFd(), "442 " + pClient.getNick() + " " + pSplited_cmd[1] + " :You're not on that channel.", true));
    else if (channel->isModeTopicRestrict() && channel->isClientOperator(pClient) == false)
        return (pServer.sendToClientFd(pClient.getFd(), "482 " + pClient.getNick() + " " + pSplited_cmd[1] + " :You're not a channel operator.", true));
    else if (pSplited_cmd.size() == 2)
    {
        std::string const & topic = channel->getTopic();
        if (topic.empty())
            return (pServer.sendToClientFd(pClient.getFd(), "331 " + pClient.getNick() + " " + pSplited_cmd[1] + " :No topic is set.", true));
        pServer.sendToClientFdNoProtection(pClient.getFd(), "332 " + pClient.getNick() + " " + pSplited_cmd[1] + " :" + topic, true);
        return (pServer.sendToClientFd(pClient.getFd(), "333 " + pClient.getNick() + " " + pSplited_cmd[1] + " " + channel->getTopicLastModifiedAndDate(), true));
    }
    std::string topic_name;
    if (pSplited_cmd[2].length() > TOPIC_MAX_LEN) // TOPIC_MAX_LEN to avoid 512 limit irc.libera.chat
        topic_name = pSplited_cmd[2].substr(0, TOPIC_MAX_LEN);
    else
        topic_name = pSplited_cmd[2];
    std::map<Client *, bool> const & clients_channel = channel->getClientsChannel();
    for (std::map<Client *, bool>::const_iterator it = clients_channel.begin(); it != clients_channel.end(); it++)
        pServer.sendToClientFdNoProtection(it->first->getFd(), ":" + pClient.getNickuserhost()+ " TOPIC " + pSplited_cmd[1] + " :" + topic_name, false); // FINDALT : here broadcast clientChannel + me, *can secure me
    channel->setTopic(topic_name);
    channel->setTopicLastModifiedAndDate(pClient.getNickuserhost());
    return (false);
}
