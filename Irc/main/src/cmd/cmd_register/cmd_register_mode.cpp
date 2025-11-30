#include "cmd/cmd_register.hpp"

static int mode_get_strictly_pos_int(char const * userlimit_str)
{
    char        *end;
    long int    userlimit = strtol(userlimit_str, &end, 10);
    if (errno == ERANGE)
    {
        std::cerr << "Warning: get_userlimit: ERANGE port" << std::endl;
        return (-1);
    }
    else if (userlimit <= 0 || userlimit > std::numeric_limits<int>::max())
    {
        std::cerr << "Warning: get_userlimit: need to be between 1 and INT_MAX" << std::endl;
        return (-1);
    }
    return (static_cast<int>(userlimit));
}

// do not support umodes, not necessary
bool cmd_register_mode(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd)
{
    if (pClient.isRegistered() == false)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NOTREGISTERED + " * :You have not registered", true)); // * is not link to nick in irc.libera.chat
    else if (pSplited_cmd.size() < 2)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NEEDMOREPARAMS + " " + pClient.getNick() + " MODE :Not enough parameters", true));

    std::string const & target = pSplited_cmd[1];
    if (target[0] == '#')
    {
        Channel *channel = pServer.getChannelByName(target);
        if (channel == NULL)
            return (pServer.sendToClientFd(pClient.getFd(), ERR_NOSUCHCHANNEL + " " + pClient.getNick() + " " + target + " :No such channel", true));
        if (pSplited_cmd.size() == 2)
        {
            std::string modes;
            if (channel->isModeInviteOnly())
                modes += "i";
            if (channel->isModeTopicRestrict())
                modes += "t";
            if (channel->isModeKeyProtected())
                modes += "k";
            if (channel->isModeUserLimited())
                modes += "l";
            pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_CHANNELMODEIS + " " + pClient.getNick() + " " + target + " +" + modes, true);
            return (pServer.sendToClientFd(pClient.getFd(), RPL_CREATIONTIME + " " + pClient.getNick() + " " + target + " " + channel->getStartDate(), true));
        }
        else
        {
            if (channel->isClientPresent(pClient) == false) 
                return (pServer.sendToClientFd(pClient.getFd(), ERR_CHANOPRIVSNEEDED + " " + pClient.getNick() + " " + target + " :You're not a channel operator", true)); // could be 442, not in irc.liberachat
            else if (channel->isClientOperator(pClient) == false)
                return (pServer.sendToClientFd(pClient.getFd(), ERR_CHANOPRIVSNEEDED + " " + pClient.getNick() + " " + target + " :You're not a channel operator.", true));
            
            std::string const & modes_splited = pSplited_cmd[2];
            size_t arg_needed = 0;
            int nbr_omode = 0;
            bool modeValue = true;
            for (size_t i = 0; i < modes_splited.size(); ++i)
            {
                if (modes_splited[i] == '+')
                    modeValue = true;
                else if (modes_splited[i] == '-')
                    modeValue = false;
                else if (modes_splited[i] == 'k')
                {
                    if (modeValue == true)
                        arg_needed++;
                }
                else if (modes_splited[i] == 'l')
                {
                    if (modeValue == true)
                        arg_needed++;
                }
                else if (modes_splited[i] == 'o')
                {
                    nbr_omode++; 
                    if (nbr_omode > MAX_OMODE)
                    {
                        std::cerr << "Warning: cmd_register_mode: rfc1459 set max [+/-]o change to 3 per /MODE" << std::endl;
                        return (pServer.sendToClientFd(pClient.getFd(), ERR_INVALIDMODEPARAM + " " + pClient.getNick() + " :rfc1459 set max [+/-]o change to 3 per /MODE", true));
                    }
                    arg_needed++;
                }
                else if (modes_splited[i] != 'i' && modes_splited[i] != 't')
                    return (pServer.sendToClientFd(pClient.getFd(), "472 " + pClient.getNick() + " " + modes_splited[i] + " :is an unknown mode char to me", true));
            }
            if (arg_needed + 3 > pSplited_cmd.size())
                return (pServer.sendToClientFd(pClient.getFd(), ERR_NEEDMOREPARAMS + " " + pClient.getNick() + " MODE :Not enough parameters", true));

            std::string mode_broadcast = "";
            arg_needed = 3;
            std::vector<std::string> elem_passed;
            modeValue = true;
            for (size_t i = 0; i < modes_splited.size(); ++i)
            {
                if (modes_splited[i] == '+')
                    modeValue = true;
                else if (modes_splited[i] == '-')
                    modeValue = false;
                else if (modes_splited[i] == 'i' && channel->setModeStage(MODESTA_I, modeValue) == 1) // == 1 if value change
                {
                    if (modeValue == true)
                        mode_broadcast += "+i";
                    else
                        mode_broadcast += "-i";
                }
                else if (modes_splited[i] == 't' && channel->setModeStage(MODESTA_T, modeValue) == 1) // == 1 if value change
                {
                    if (modeValue == true)
                        mode_broadcast += "+t";
                    else
                        mode_broadcast += "-t";
                }
                else if (modes_splited[i] == 'k')
                {
                    if (modeValue == true) // for +k always change
                    {
                        channel->setModeStage(MODESTA_K, modeValue);
                        mode_broadcast += "+k";
                        std::string new_key = pSplited_cmd[arg_needed];
                        arg_needed++;
                        new_key.erase(std::remove_if(new_key.begin(), new_key.end(), ::isspace), new_key.end()); // remove all isspace
                        channel->setKey(new_key); 
                        elem_passed.push_back(new_key);
                    }
                    else if (modeValue == false && channel->setModeStage(MODESTA_K, modeValue) == 1) // == 1 if value change
                    {
                        channel->setKey("*");
                        mode_broadcast += "-k";
                        elem_passed.push_back("*"); // needed in hexchat
                    }
                }
                else if (modes_splited[i] == 'l')
                {
                    if (modeValue == true) // for +l always change
                    {
                        int userlimit = mode_get_strictly_pos_int(pSplited_cmd[arg_needed].c_str());
                        arg_needed++;
                        if (userlimit == -1) // +l ignored if userlimit 0 or overflow
                            continue;
                        channel->setModeStage(MODESTA_L, modeValue);
                        mode_broadcast += "+l";
                        channel->setUserLimit(userlimit);
                        elem_passed.push_back(intToString(userlimit));
                    }
                    else if (modeValue == false && channel->setModeStage(MODESTA_L, modeValue) == 1) // == 1 if value change
                    {
                        channel->setUserLimit(0);
                        mode_broadcast += "-l";
                    }
                }
                else if (modes_splited[i] == 'o')
                {
                    Client *targetClient = channel->getClientChannelByNick(pSplited_cmd[arg_needed]);
                    arg_needed++;
                    if (targetClient == NULL)
                    {
                        pServer.sendToClientFdNoProtection(pClient.getFd(), "401 " + pClient.getNick() + " " + pSplited_cmd[arg_needed - 1] + " :No such nick/channel", true);
                        continue;
                    }
                    if (modeValue == true) // here multiple broadcast of the same modeValue can be made irc.libera.chat but no -oo or +oo it will be separate
                        mode_broadcast += "+o";
                    else
                        mode_broadcast += "-o";
                    elem_passed.push_back(pSplited_cmd[arg_needed - 1]);
                    channel->setClientOperator(*targetClient, modeValue); // to know if -o+o myself i will still be operator, normal choice see irc.libera.chat
                }
            }
            if (mode_broadcast.empty() == false)
            {
                for (std::vector<std::string>::const_iterator it = elem_passed.begin(); it != elem_passed.end(); it++)
                    mode_broadcast += " " + *it;
                for (std::map<Client *, bool>::const_iterator it = channel->getClientsChannel().begin(); it != channel->getClientsChannel().end(); it++) // FINDALT : here broadcast clientChannel + me, *can secure me
                    pServer.sendToClientFdNoProtection(it->first->getFd(), ":" + pClient.getNickuserhost() + " MODE " + channel->getName() + " " + mode_broadcast, false);
                return (false);
            }
            return (false);
        }
    }
    return (false);
}
