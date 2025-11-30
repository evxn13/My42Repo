#include "class/Channel.hpp"

static std::string getTimeEpochString(void)
{
    std::time_t now = std::time(0);
    std::ostringstream oss;
    oss << now;
    return (oss.str());
}

Channel::Channel(std::string const & pName) : _name(pName), _startDate(getTimeEpochString()), _userLimit(0), _modesStage(0) {}

Channel::~Channel() {}




std::map<Client *, bool> const & Channel::getClientsChannel(void) const
{
    return _clientsChannel;
}

void Channel::addClient(Client & pClient, bool pOperatorValue)
{
    _clientsChannel[&pClient] = pOperatorValue;
}

void Channel::removeClient(Client & pClient)
{
    _clientsChannel.erase(&pClient);
}

void Channel::deleteClientByNick(const std::string & pNick)
{
    for (std::map<Client *, bool>::iterator it = _clientsChannel.begin(); it != _clientsChannel.end(); it++)
    {
        if (it->first->getNick() == pNick)
        {
            _clientsChannel.erase(it);
            return;
        }
    }
}

int Channel::getClientCount(void) const
{
    return (_clientsChannel.size());
}

Client * Channel::getClientChannelByNick(const std::string & pNick) const
{
    for (std::map<Client *, bool>::const_iterator it = _clientsChannel.begin(); it != _clientsChannel.end(); it++)
    {
        if (it->first->getNick() == pNick)
            return (it->first);
    }
    return (NULL);
}

bool Channel::isClientPresent(Client & pClient) const
{
    return _clientsChannel.find(&pClient) != _clientsChannel.end();
}

bool Channel::isClientOperator(Client & pClient) const
{
    std::map<Client *, bool>::const_iterator it = _clientsChannel.find(&pClient);
    if (it != _clientsChannel.end())
        return (it->second);
    std::cerr << "Error/Warning: Channel::isClientOperator: client not present" << std::endl;
    return (false);
}

void Channel::setClientOperator(Client & pClient, bool pOperatorValue)
{
    std::map<Client *, bool>::iterator it = _clientsChannel.find(&pClient);
    if (it != _clientsChannel.end())
        it->second = pOperatorValue;
    else
        std::cerr << "Error/Warning: Channel::setClientOperator: client not present" << std::endl;
}




std::string const & Channel::getName(void) const
{
    return (_name);
}

std::string const & Channel::getStartDate(void) const
{
    return (_startDate);
}

std::string const & Channel::getTopic(void) const
{
    return (_topic);
}

const std::string & Channel::getKey(void) const
{
    return (_key);
}

std::string const & Channel::getTopicLastModifiedAndDate(void) const
{
    return (this->_lastModifiedAndDate);
}

int const & Channel::getUserLimit(void) const
{
    return (_userLimit);
}



void Channel::setTopic(std::string const & pTopic)
{
    _topic = pTopic;
}

void Channel::setKey(const std::string & pKey)
{
    _key = pKey;
}

void Channel::setTopicLastModifiedAndDate(const std::string & pNickuserhost)
{
    this->_lastModifiedAndDate = pNickuserhost + " " + getTimeEpochString();
}

void Channel::setUserLimit(int pLimit)
{
    _userLimit = pLimit;
}




int Channel::setModeStage(e_mode_stage pMode, bool pModeValue)
{
    if (pModeValue == ((this->_modesStage & (1 << pMode)) != 0))
        return (0); // already set

    if (pModeValue)
        this->_modesStage |= (1 << pMode);
    else
        this->_modesStage &= ~(1 << pMode);
    return (1);
}

bool Channel::isModeInviteOnly(void) const
{
    return ((this->_modesStage & MODESTA_I_ACCESS) != 0);
}

bool Channel::isModeTopicRestrict(void) const
{
    return ((this->_modesStage & MODESTA_T_ACCESS) != 0);
}
bool Channel::isModeKeyProtected(void) const
{
    return ((this->_modesStage & MODESTA_K_ACCESS) != 0);
}

bool Channel::isModeUserLimited(void) const
{
    return ((this->_modesStage & MODESTA_L_ACCESS) != 0);
}
