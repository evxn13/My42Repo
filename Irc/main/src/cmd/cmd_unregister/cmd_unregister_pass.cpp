#include "cmd/cmd_unregister.hpp"

bool cmd_unregister_pass(Server & pServer, Client & pClient, std::vector<std::string> & pSplited_cmd)
{
    if (pSplited_cmd.size() < 2)
    {
        std::cerr << "Error: cmd_unregister_pass: Not enough parameters" << std::endl;
        return (pServer.sendToClientFd(pClient.getFd(), ERR_NEEDMOREPARAMS + " " + pClient.getNick() + " PASS :Not enough parameters", true));
    }
    else if (pServer.getPassword() != pSplited_cmd[1])
    {
        std::cerr << "Error: cmd_unregister_pass: Password incorrect" << std::endl;
        return (pServer.sendToClientErrorAndDisconnect(pClient, "(Password incorrect)"));
    }
    pClient.setRegistrationStage(REGSTA_PASS_VALIDATED);
    return (false);
}
