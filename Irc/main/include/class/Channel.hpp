#ifndef CHANNEL_HPP
# define CHANNEL_HPP

# include <iostream>
# include <string>
# include <map>
# include <vector>
# include <ctime>
# include <sstream>

# include "class/Client.hpp"

class Client;

enum e_mode_stage
{
    MODESTA_I   = 0, // 00000001
    MODESTA_T   = 1, // 00000010
    MODESTA_K   = 2, // 00000100
    MODESTA_L   = 3, // 00001000

    MODESTA_I_ACCESS = 0b00000001,
    MODESTA_T_ACCESS = 0b00000010,
    MODESTA_K_ACCESS = 0b00000100,
    MODESTA_L_ACCESS = 0b00001000
};

class Channel
{
    private:
        std::map<Client *, bool>    _clientsChannel;

        const std::string           _name;
        const std::string           _startDate;
        std::string                 _topic;
        std::string                 _key;
        int                         _userLimit;
        unsigned char               _modesStage;
        std::string                 _lastModifiedAndDate;
    public:
        Channel(const std::string & pName);
        ~Channel();

        std::map<Client *, bool> const & getClientsChannel(void) const;
        void addClient(Client & pClient, bool pOperatorValue);
        void removeClient(Client & pClient);
        void deleteClientByNick(const std::string & pNick);
        int getClientCount(void) const;
        Client * getClientChannelByNick(const std::string & pNick) const;
        bool isClientPresent(Client & pClient) const;
        bool isClientOperator(Client & pClient) const;
        void setClientOperator(Client & pClient, bool pOperatorValue);
        

        std::string const & getName(void) const;
        std::string const & getStartDate(void) const;
        std::string const & getTopic(void) const;
        std::string const & getKey(void) const;
        std::string const & getTopicLastModifiedAndDate(void) const;
        int const & getUserLimit(void) const;

        void setTopic(const std::string & pTopic);
        void setKey(const std::string & pKey);
        void setTopicLastModifiedAndDate(const std::string & pNickuserhost);
        void setUserLimit(int pLimit);
        int setModeStage(e_mode_stage pMode, bool pModeValue);
        
        bool isModeInviteOnly(void) const;
        bool isModeTopicRestrict(void) const;
        bool isModeKeyProtected(void) const;
        bool isModeUserLimited(void) const;
};

#endif
