#ifndef CLIENT_HPP
# define CLIENT_HPP

# include <string>
# include <algorithm>
# include <set>

enum e_registration_stage
{
    REGSTA_CAP_DETECTED     = 1 << 0, // 00000001
    REGSTA_CAP_ENDED        = 1 << 1, // 00000010
    REGSTA_PASS_VALIDATED   = 1 << 2, // 00000100
    REGSTA_NICK_VALIDATED   = 1 << 3, // 00001000
    REGSTA_USER_VALIDATED   = 1 << 4, // 00010000
    REGSTA_REGISTERED       = 1 << 7, // 10000000
    REGSTA_COMPLETE_CAP     = 0x1F,   // 00011111
    REGSTA_COMPLETE_CAP_END = 0x1E,   // 00011110
    REGSTA_COMPLETE_NOCAP   = 0x1C    // 00011100
};

class Client
{
    private:
        std::set<std::string>   _invitedChannels;
        const int               _fd;
        const std::string       _clientHostname;
        const std::string       _serverHostname;
        std::string             _pass;
        std::string             _nick;
        std::string             _user;
        std::string             _realname;
        std::string             _nickuserhost;
        unsigned char           _registrationStage;
    public:
        std::string             stringBuffer;

    private:
        Client(Client const & pCopy);
        Client & operator=(Client const & pRhs);
    public:
        Client(int const & pFd, std::string const & pClientHostname, std::string const & pServerHostname);
        ~Client(void);

        void    addInvitation(std::string const & pChannelName);
        bool    isInvited(std::string const & pChannelName);
        void    deleteInvitation(std::string const & pChannelName);

        int         const & getFd(void) const;
        std::string const & getClientHostname(void) const;
        std::string const & getServerHostname(void) const;
        std::string const & getPass(void) const;
        std::string const & getNick(void) const;
        std::string const & getUser(void) const;
        std::string const & getRealname(void) const;
        std::string const & getNickuserhost(void) const;

        void setPass(std::string const & pPass);
        void setNick(std::string const & pNick);
        void setUser(std::string const & pUser);
        void setRealname(std::string const & pHostname);
        void setRegistrationStage(e_registration_stage pStage);

        bool    isPasswordReceive(void) const;
        bool    isUserReceive(void) const;
        bool    isRegistered(void) const;
        bool    isFirstStageComplete(void) const;

};

#endif
