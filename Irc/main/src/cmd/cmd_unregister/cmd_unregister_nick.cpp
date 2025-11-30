#include "cmd/cmd_unregister.hpp"

// cmd_unregister_user call cmd_register_motd
bool cmd_unregister_nick(Server & pServer, Client & pClient, std::vector<std::string> const & pSplited_cmd)
{
    // do not support ERR_NICKCOLLISION because one server only
    if (pClient.isPasswordReceive() == false)
    {
        std::cerr << "Error: manageCmd: need to send pass command before nick" << std::endl;
        return (pServer.sendToClientErrorAndDisconnect(pClient, "(need to send pass command before nick)"));
    }
    else if (pSplited_cmd.size() < 2)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NONICKNAMEGIVEN + " " + pClient.getNick() + " :No nickname given", true));
    std::string nick;
    if (pSplited_cmd[1].length() > NICK_MAX_LEN)
        nick = pSplited_cmd[1].substr(0, NICK_MAX_LEN);
    else
        nick = pSplited_cmd[1];
    if (nick[0] == '$' || nick[0] == ':' || nick[0] == '#' || nick[0] == '&' || nick.find_first_of(" *,?!@") != std::string::npos) // Regular Channels and Local Channels ?
        return (pServer.sendToClientFd(pClient.getFd(), ERR_ERRONEUSNICKNAME + " " + pClient.getNick() + " " + nick + " :Erroneous nickname", true));
    else if (pClient.getNick() == nick)
        return (false);
    std::map<int, Client *> const & clientsServer = pServer.getClientsServer();
    for (std::map<int, Client *>::const_iterator it = clientsServer.begin(); it != clientsServer.end(); it++) // FINDALT : here search clientServer for same nick
    {
        if (it->second != &pClient && it->second->getNick() == nick)
        {
            return (pServer.sendToClientFd(pClient.getFd(), ERR_NICKNAMEINUSE + " " + pClient.getNick() + " " + nick + " :Nickname is already in use", true));
        }
    }
    std::string oldNick = pClient.getNick();
    std::string oldNickUserHost = pClient.getNickuserhost();
    pClient.setNick(nick);
    if (pClient.isRegistered() == true)
        return (pServer.sendToClientFd(pClient.getFd(), ":" + oldNickUserHost + " NICK :" + nick, false));
    else if (oldNick == "*")
    {
        pClient.setRegistrationStage(REGSTA_NICK_VALIDATED);
        return (cmd_register_motd(pServer, pClient));
    }
    std::cerr << "Error/warning: cmd_unregister_nick: should not pass here" << std::endl;
    return (false);
}
