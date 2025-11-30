#include "class/Client.hpp"

Client::Client(int const & pFd, std::string const & pClientHostname, std::string const & pServerHostname) 
: _fd(pFd), _clientHostname(pClientHostname), _serverHostname(pServerHostname), _nick("*"), _registrationStage(0) {}

Client::~Client(void) {}

void    Client::addInvitation(std::string const & pChannelName)
{
    this->_invitedChannels.insert(pChannelName);
}

bool Client::isInvited(std::string const & pChannelName)
{
    std::set<std::string>::iterator it = _invitedChannels.find(pChannelName);
    if (it == _invitedChannels.end())
        return (false);
    return (true);
}

void    Client::deleteInvitation(std::string const & pChannelName)
{
    std::set<std::string>::iterator find = this->_invitedChannels.find(pChannelName);
    if (find != this->_invitedChannels.end())
        this->_invitedChannels.erase(find);
}



int             const & Client::getFd(void) const {return this->_fd;};
std::string     const & Client::getClientHostname(void) const {return this->_clientHostname;}
std::string     const & Client::getServerHostname(void) const {return this->_serverHostname;}
std::string     const & Client::getPass(void) const {return this->_pass;}
std::string     const & Client::getNick(void) const {return this->_nick;}
std::string     const & Client::getUser(void) const {return this->_user;}
std::string     const & Client::getRealname(void) const {return this->_realname;}
std::string     const & Client::getNickuserhost(void) const {return this->_nickuserhost;}




void Client::setPass(std::string const & pPass) {this->_pass = pPass;}
void Client::setNick(std::string const & pNick)
{
    this->_nick = pNick;
    this->_nickuserhost = pNick + "!~" + this->_user + "@" + this->_clientHostname;
}
void Client::setUser(std::string const & pUser)
{
    this->_user = pUser;
    this->_nickuserhost = this->_nick + "!~" + pUser + "@" + this->_clientHostname;
}
void Client::setRealname(std::string const & pRealname) {this->_realname = pRealname;}
void Client::setRegistrationStage(e_registration_stage pStage)
{
    this->_registrationStage |= pStage;
}




bool                    Client::isPasswordReceive(void) const
{
    return ((this->_registrationStage & REGSTA_PASS_VALIDATED) != 0);
}

bool                    Client::isUserReceive(void) const
{
    return ((this->_registrationStage & REGSTA_USER_VALIDATED) != 0);
}

bool                    Client::isRegistered(void) const
{
    return ((this->_registrationStage & REGSTA_REGISTERED) != 0);
}

bool                    Client::isFirstStageComplete(void) const // to use only for validating registration (send MOTD), this return false after due to REGSTA_REGISTERED set to 1
{
    if (this->_registrationStage == REGSTA_COMPLETE_CAP || \
        this->_registrationStage == REGSTA_COMPLETE_CAP_END || \
        this->_registrationStage == REGSTA_COMPLETE_NOCAP)
    {
        return (true);
    }
    return (false);
}
