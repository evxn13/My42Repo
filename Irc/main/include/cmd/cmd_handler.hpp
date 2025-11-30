#ifndef CMD_HANDLER_HPP
# define CMD_HANDLER_HPP

# include <string>
# include <iostream>
# include <sstream>
# include <vector>
# include <algorithm>

# include <sys/types.h> // for send
# include <sys/socket.h> // for send

# include "class/Server.hpp"
# include "class/Client.hpp"
# include "cmd/cmd_register.hpp"
# include "cmd/cmd_unregister.hpp"

class Server;
class Client;

// limitation to avoid server response bigger than 512
const size_t      NICK_MAX_LEN = 16; // differ from the 9 of RFC 1459
const size_t      USER_MAX_LEN = 9; // irc.libera.chat limit
const size_t      REALNAME_MAX_LEN = 50; // irc.libera.chat limit
const size_t      TOPIC_MAX_LEN = 390; 
const size_t      CHANNEL_MAX_LEN = 50;
const size_t      CMD_SECURITY_SIZE = 123;
const size_t      CMD_MAX_SIZE = 510; // remove \r\n 512

const std::string ERR_INPUTTOOLONG ("417"); // "<client> :Input line was too long"

const std::string ERR_INVALIDCAPCMD("410"); // "<client> <command> :Invalid CAP subcommand" CONFLIT

const std::string ERR_NONICKNAMEGIVEN("431"); // "<client> :No nickname given"
const std::string ERR_ERRONEUSNICKNAME("432"); // "<client> <nick> :Erroneous nickname" CONFLIT 'Errone*O*us'
const std::string ERR_NICKNAMEINUSE("433"); // "<client> <nick> :Nickname is already in use"

const std::string ERR_NEEDMOREPARAMS("461"); // "<client> <command> :Not enough parameters"
const std::string ERR_ALREADYREGISTERED("462"); // "<client> :You are already connected and cannot handshake again"

const std::string RPL_WHOREPLY("352"); // "<client> <channel> <username> <host> <server> <nick> <flags> :<hopcount> <realname>"
const std::string RPL_ENDOFWHO("315"); // "<client> <mask> :End of WHO list"

const std::string ERR_NOSUCHCHANNEL("403"); // "<client> <channel> :No such channel"
const std::string RPL_INFO("371"); // "<client> :<string>"

const std::string RPL_WELCOME("001"); // "<client> :Welcome to the <networkname> Network, <nick>[!<user>@<host>" CONFLIT 'after Network'
const std::string RPL_YOURHOST("002"); // "<client> :Your host is <servername>, running version <version>"
const std::string RPL_CREATED("003"); // "<client> :This server was created <datetime>"
const std::string RPL_MYINFO("004"); // "<client> <servername> <version> <available user modes> <available channel modes> [<channel modes with a parameter>]"
const std::string RPL_ISUPPORT("005"); // "<client> <1-13 tokens> :are supported by this server"
const std::string RPL_MOTDSTART("375"); // "<client> :- <server> Message of the day - "
const std::string RPL_MOTD("372"); // "<client> :<line of the motd>"
const std::string RPL_ENDOFMOTD("376"); // "<client> :End of /MOTD command."

const std::string RPL_TOPIC("332"); // "<client> <channel> :<topic>"
const std::string RPL_NAMREPLY("353"); //   "<client> <symbol> <channel> :[prefix]<nick>{ [prefix]<nick>}" symbol always secret channel '@' !
const std::string RPL_ENDOFNAMES("366"); // "<client> <channel> :End of /NAMES list"
const std::string RPL_CHANNELMODEIS("324");
const std::string RPL_CREATIONTIME("329"); // "<client> <channel> <creationtime>"
const std::string RPL_UMODEIS ("221");
const std::string ERR_NOSUCHNICK ("401");



const std::string ERR_CHANNELISFULL ("471");
const std::string ERR_INVITEONLYCHAN ("473");
const std::string ERR_BADCHANNELKEY ("475");
const std::string ERR_CHANOPRIVSNEEDED ("482");

const std::string ERR_NOTREGISTERED ("451"); // "<client> :You have not registered" here <client> look to be always * in irc.libera.chat

const std::string ERR_INVALIDMODEPARAM ("696"); // "<client> <target chan/user> <mode char> <parameter> :<description>"

bool manageCmd(Server & pServer, Client & pClient, std::string const & pCmd);

#endif
