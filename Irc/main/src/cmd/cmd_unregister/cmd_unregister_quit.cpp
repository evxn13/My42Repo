#include "cmd/cmd_unregister.hpp"

// quit special just disconnect no use of pSplited_cmd
bool cmd_unregister_quit(Server & pServer, Client & pClient)
{
    pServer.disconnectClientFd(pClient.getFd());
    return (true);
}
