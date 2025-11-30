#include "cmd/cmd_unregister.hpp"

// cmd_unregister_user call cmd_register_motd
bool cmd_unregister_cap(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd)
{
    // do not support cap specification 'ACK/NAK' client from draft-mitchell-irc-capabilities- instead use ircv3
    // do not support 'cap ls 302/version' or 'cap-notify' cap -> to be notify when 'cap new/del' when new cap are added by server
    if (pSplited_cmd.size() < 2)
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NEEDMOREPARAMS + " " + pClient.getNick() + " CAP :Not enough parameters", true));
    std::string secondCmdUpped(stringToUpper(pSplited_cmd[1]));
    if (secondCmdUpped == "REQ")
    {
        pClient.setRegistrationStage(REGSTA_CAP_DETECTED);
        std::vector<std::string>::const_iterator itThirdCmd = pSplited_cmd.begin() + 2;
        if (itThirdCmd == pSplited_cmd.end())
            return (false);
        return (pServer.sendToClientFd(pClient.getFd(), "CAP " + pClient.getNick() + " NAK :" + *itThirdCmd, true)); // NOCAP refuse all req
    }
    else if (secondCmdUpped == "END")
    {
        pClient.setRegistrationStage(REGSTA_CAP_ENDED);
        return (cmd_register_motd(pServer, pClient));
    }
    else if (secondCmdUpped == "LS")
    {
        pClient.setRegistrationStage(REGSTA_CAP_DETECTED);
        return (pServer.sendToClientFd(pClient.getFd(), "CAP " + pClient.getNick() + " LS :", true)); // NOCAP
    }
    else if (secondCmdUpped == "LIST")
    {
        pClient.setRegistrationStage(REGSTA_CAP_DETECTED);
        return (pServer.sendToClientFd(pClient.getFd(), "CAP " + pClient.getNick() + " LIST :", true)); // NOCAP
    }
    std::cerr << "Error: cmd_unregister_cap: Invalid CAP subcommand" << std::endl;
    return (pServer.sendToClientFd(pClient.getFd(), ERR_INVALIDCAPCMD + " " + pClient.getNick() + " " + pSplited_cmd[1] + " :Invalid CAP subcommand", true));
}
