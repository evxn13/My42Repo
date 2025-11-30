#include "cmd/cmd_register.hpp"

bool cmd_register_join(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd)
{
    if (pClient.isRegistered() == false)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NOTREGISTERED + " * :You have not registered", true)); // * is not link to nick in irc.libera.chat
    else if (pSplited_cmd.size() < 2)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NEEDMOREPARAMS + " " + pClient.getNick() + " JOIN :Not enough parameters", true)); 

    std::set<std::string> channelNameSet = splitToSet(pSplited_cmd[1], ',');
    std::vector<std::string> channelKeyVec;
    size_t searchKey = 0;
    Channel * channel;
    if (pSplited_cmd.size() > 2)
        channelKeyVec = splitToVector(pSplited_cmd[2], ',');
    for (std::set<std::string>::const_iterator itChannelName = channelNameSet.begin(); itChannelName != channelNameSet.end(); itChannelName++)
    {
        if (itChannelName->length() > CHANNEL_MAX_LEN)
        {
            pServer.sendToClientFdNoProtection(pClient.getFd(), "479 " + pClient.getNick() + " " + itChannelName->substr(0, CHANNEL_MAX_LEN) + "[cropped] :Illegal channel name", true);  // special case of libera.chat but secure ourself too (512 limits)
            continue;
        }
        else if ((*itChannelName)[0] != '#')
        {
            pServer.sendToClientFdNoProtection(pClient.getFd(), ERR_NOSUCHCHANNEL + " " + pClient.getNick() + " " + *itChannelName + " :No such channel", false);
            continue;
        }
        searchKey++;
        channel = pServer.getChannelByName(*itChannelName);
        if (channel == NULL)
        {
            // choose to not set mode to +t at start (irc.libera.chat)
            channel = pServer.createChannel(*itChannelName);
            if (channel == NULL)
            {
                std::cerr << "Error: cmd_rpl::cmd_register_join: fail to create channel" << std::endl;
                return (pServer.sendToClientErrorAndDisconnect(pClient, "(fail to create channel)")); // our own treatement
            }
            channel->addClient(pClient, true);
        }
        else
        {
            if (channel->getClientChannelByNick(pClient.getNick()) != NULL)
                continue;
            else if (channel->isModeUserLimited() && channel->getClientCount() >= channel->getUserLimit() && pClient.isInvited(*itChannelName) == false) // invite bypass userlimit
            {
                pServer.sendToClientFdNoProtection(pClient.getFd(), ERR_CHANNELISFULL + " " + pClient.getNick() + " " + *itChannelName + " :Cannot join channel (+l)", true);
                continue;
            }
            else if (channel->isModeInviteOnly() && pClient.isInvited(*itChannelName) == false)
            {
                pServer.sendToClientFdNoProtection(pClient.getFd(), ERR_INVITEONLYCHAN + " " + pClient.getNick() + " " + *itChannelName + " :Cannot join channel (+i)", true);
                continue;
            }
            else if (channel->isModeKeyProtected() && (searchKey > channelKeyVec.size() || channel->getKey() != channelKeyVec[searchKey - 1])) // searchKey - 1 can be dangerous but it always positive here
            {
                pServer.sendToClientFdNoProtection(pClient.getFd(), ERR_BADCHANNELKEY + " " + pClient.getNick() + " " + *itChannelName + " :Cannot join channel (+k)", true);
                continue;
            }
            pClient.deleteInvitation(*itChannelName); // delete invitation if present
            channel->addClient(pClient, false);
        }
        std::map<Client *, bool> const & clients_channel = channel->getClientsChannel();
        for (std::map<Client *, bool>::const_iterator it = clients_channel.begin(); it != clients_channel.end(); it++)
            pServer.sendToClientFdNoProtection(it->first->getFd(), ":" + pClient.getNickuserhost() + " JOIN " + *itChannelName + " * :" + pClient.getRealname(), false); // FINDALT : here broadcast clientChannel + me, *can secure me
        if (channel->getTopic().empty() == false && pServer.sendToClientFd(pClient.getFd(), RPL_TOPIC + " " + pClient.getNick() + " " + *itChannelName + " :" + channel->getTopic(), true) == true)
            return (true); // maybe do 333, here fail to send
        std::vector<std::string> splited_cmd_name;
        splited_cmd_name.push_back("NAMES"); // names can handle ,, that would avoid creating splited_cmd_name
        splited_cmd_name.push_back(*itChannelName);
        cmd_register_names(pServer, pClient, splited_cmd_name); // cmd_register_join call cmd_register_names avoid recursive
    }
    return (false);
}
