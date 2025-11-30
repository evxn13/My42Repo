#include "cmd/cmd_unregister.hpp"

// cmd_unregister_user call cmd_register_motd
bool cmd_unregister_user(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd)
{
    if (pClient.isPasswordReceive() == false)
    {
        std::cerr << "Error: manageCmd: need to send pass command before user" << std::endl;
        return (pServer.sendToClientErrorAndDisconnect(pClient, "(need to send pass command before user)"));
    }
    if (pClient.isRegistered() == true)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_ALREADYREGISTERED + " " + pClient.getNick() + " :You are already connected and cannot handshake again", true));
    else if (pClient.isUserReceive() == true)
        return (false);
    else if (pSplited_cmd.size() < 5)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NEEDMOREPARAMS + " " + pClient.getNick() + " USER :Not enough parameters", true));
    std::string username("");
    for (std::string::iterator it = pSplited_cmd[1].begin(); it != pSplited_cmd[1].end(); it++)
    {
        if (username.length() < USER_MAX_LEN && std::isalnum(*it)) // our own treatement
            username += *it;
        else
            break;
    }
    if (username.empty())
    {
        std::cerr << "Error: cmd_unregister_pass: Invalid username" << std::endl;
        pServer.sendToClientFd(pClient.getFd(), + "NOTICE " + pClient.getNick() +" :*** Your username is invalid. Please make sure that your username contains only alphanumeric characters.", true);
        return (pServer.sendToClientErrorAndDisconnect(pClient, "(Invalid username [~])"));
    }
    pClient.setUser(username);
    std::string realname;
    if (pSplited_cmd[4].length() > REALNAME_MAX_LEN)
        realname = pSplited_cmd[4].substr(0, REALNAME_MAX_LEN);
    else
        realname = pSplited_cmd[4];
    pClient.setRealname(realname);
    pClient.setRegistrationStage(REGSTA_USER_VALIDATED);
    return (cmd_register_motd(pServer, pClient));
}
