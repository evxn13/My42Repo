# include "cmd/cmd_register.hpp"

// this implementation of motd don't send ERR_NOTREGISTERED if motd are send before registration, because this motd is also use to enable REGSTA_REGISTERED
bool cmd_register_motd(Server & pServer, Client & pClient)
{
    if (pClient.isRegistered() == false)
    {
        if (pClient.isFirstStageComplete() == false)
            return (false);
        else
        {
        pClient.setRegistrationStage(REGSTA_REGISTERED); // set isRegistered() to true and isFirstStageComplete() to false now
        pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_WELCOME + " " + pClient.getNick() + " :Welcome to the աɧȝՐȝ ɿՏ ՎԾՄՐ ՏԾՇƙȝԵ ┌(˘⌣˘)ʃ Internet Relay Chat Network, " + pClient.getNick()+ "[!" + pClient.getUser() + "@" + pClient.getClientHostname() + "]", true);
        pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_YOURHOST + " " + pClient.getNick() + " :Your host is " + SERVER_NAME + "[" + pClient.getServerHostname() + "], running version 0.42", true);
        pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_CREATED + " " + pClient.getNick() + " :This server was created on " + pServer.getStartDate(), true);
        pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MYINFO + " " + pClient.getNick() + " " + SERVER_NAME + " 0.42 _ iklot klo", true);
        pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_ISUPPORT + " " + pClient.getNick() + " NICKLEN=" + size_tToString(NICK_MAX_LEN) + " USERLEN=" + size_tToString(USER_MAX_LEN) + " REALNAMELEN=" + size_tToString(REALNAME_MAX_LEN) + " CHANNELLEN=" + size_tToString(CHANNEL_MAX_LEN) + " TOPICLEN=" + size_tToString(TOPIC_MAX_LEN) + " :are supported by this server", true);
        }
    }
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTDSTART + " " + pClient.getNick() + " :- " + SERVER_NAME + " Message of the day - ", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- ******************************************", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- *     Welcome to Where_is_your_socket    *", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- *           Enjoy your stay!             *", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- ******************************************", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- *                                        *", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- * Rules:                                 *", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- *  - No spamming or flooding             *", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- *  - No offensive language               *", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- *  - Respect other users                 *", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- *  - Follow the channel guidelines       *", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- *                                        *", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- ******************************************", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- *            Have a great time!          *", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- ******************************************", true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :- ┌(˘⌣˘)ʃ       (•‿•)     (°U°)     (•̀ᴗ•́)" , true);
    pServer.sendToClientFdNoProtection(pClient.getFd(), RPL_MOTD + " " + pClient.getNick() + " :-        (╯°□°)╯     (ʘ‿ʘ)     (ᵔ◡ᵔ)" , true);
    return (pServer.sendToClientFd(pClient.getFd(), RPL_ENDOFMOTD + " " + pClient.getNick() + " :End of /MOTD command.", true)); //check only if the last send fail
}
