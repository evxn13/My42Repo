import { useEffect, useRef, useState } from 'react';
import { FaUserFriends, FaPlay } from 'react-icons/fa';
import Sidebar from '../components/layout/Sidebar';
import backgroundImage from '../assets/Background-Chat.png';
import FriendSidebar from '../components/chat/FriendSidebar';
import ChatSection from '../components/chat/ChatSection';
import LiveMatchSection from '../components/chat/LiveMatchSection';
import { useLocation } from 'react-router-dom';
import { ChatMessage, MessageSetter } from '../types/chat';

interface Friend {
  id: number;
  username: string;
  status: string;
  created_at: string;
}

export function addLocalInviteMessage(setMessages: MessageSetter, sender: string, recipient: string) {
  setMessages((prev: ChatMessage[]) => [
    ...prev,
    {
      sender,
      text: '',
      isPrivate: true,
      recipient,
      timestamp: new Date().toISOString(),
      type: 'invite',
    },
  ]);
}

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [showFriends, setShowFriends] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showLiveMatch, setShowLiveMatch] = useState(true);
  const [wsError, setWsError] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [currentUsername, setCurrentUsername] = useState<string>('');

  const socketRef = useRef<WebSocket | null>(null);
  const location = useLocation();
  
  // Fonction pour marquer les messages comme lus pour un ami
  const markMessagesAsRead = (friendUsername: string) => {
    setUnreadCounts(prev => ({
      ...prev,
      [friendUsername]: 0
    }));
  };
  
  // Fonction pour incrémenter le compteur de messages non lus
  const incrementUnreadCount = (senderUsername: string) => {
    // Ne pas compter les messages de l'utilisateur actuel
    if (senderUsername === currentUsername) return;
    
    setUnreadCounts(prev => ({
      ...prev,
      [senderUsername]: (prev[senderUsername] || 0) + 1
    }));
  };
  
  // Fonction pour charger l'historique des messages
  const loadMessageHistory = async (recipient: string | null = null) => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not available');
        return;
      }
      
      // Utiliser HTTPS si configuré, sinon HTTP
      const protocol = import.meta.env.VITE_CHAT_USE_HTTPS === 'true' ? 'https' : 'http';
      const port = import.meta.env.VITE_CHAT_USE_HTTPS === 'true' 
        ? import.meta.env.VITE_PORT_CHAT_HTTPS 
        : import.meta.env.VITE_PORT_CHAT;
      
      const endpoint = recipient 
        ? `${protocol}://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/req/messages?token=${token}&recipient=${recipient}&limit=100`
        : `${protocol}://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/req/messages?token=${token}&limit=100`;
        
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Error while messages recuperation');
      }
      
      const data = await response.json();
      setMessages(data.messages || []);
      
      // Marquer les messages comme lus pour l'ami sélectionné
      if (recipient) {
        markMessagesAsRead(recipient);
      }
    } catch (error) {
      console.error('Error while messages loading:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger l'historique quand l'ami sélectionné change
  useEffect(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN && selectedFriend) {
      loadMessageHistory(selectedFriend);
    } else if (!selectedFriend) {
      // Si aucun ami sélectionné, vider les messages
      setMessages([]);
    }
  }, [selectedFriend]);

  useEffect(() => {
    // Récupérer l'ID de l'utilisateur à partir du token JWT
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id);
        setCurrentUsername(payload.username);
      } catch (err) {
        console.error('Error while decode token:', err);
      }
    }

    // Établir la connexion WebSocket (WSS si HTTPS activé)
    const wsUrl = `wss://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/ws-chat?token=${token || ''}`;
    console.log('🔌 Connexion WebSocket', '...');
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected to server chat');
      // Charger l'historique des anciens messages publics au démarrage
      loadMessageHistory();
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Si c'est un message système avec des informations sur les utilisateurs connectés
      if (data.type === 'system' && data.connectedUsers) {
        // Récupérer le nom d'utilisateur actuel depuis le JWT
        let currentUsername = '';
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUsername = payload.username;
          } catch (err) {
            console.error('Error while decode token:', err);
          }
        }
      } else if (data.type === 'system' && data.message) {
        // Afficher les messages système comme des alertes
        console.warn(data.message);
      } else {
        // Invitation à une partie (ancienne)
        if (data.type === 'invite' && data.to === currentUsername) {
          const newMessage = {
            sender: data.username || data.from || 'System',
            text: '',
            isPrivate: true,
            recipient: data.to,
            timestamp: new Date().toISOString(),
            type: 'invite',
          };
          setMessages(prev => [...prev, newMessage]);
          return;
        }
        
        // Invitation à une partie de jeu avec room ID
        if (data.type === 'game_invite') {
          const newMessage = {
            sender: data.from || 'System',
            from: data.from,
            text: data.message || '',
            isPrivate: true,
            recipient: currentUsername,
            timestamp: new Date().toISOString(),
            type: 'game_invite',
            roomId: data.roomId,
          };
          setMessages(prev => [...prev, newMessage]);
          return;
        }
        
        // Historique de jeu
        if (data.type === 'game_history') {
          const newMessage = {
            sender: data.from || 'Game system',
            from: data.from,
            text: data.message || '',
            isPrivate: true,
            recipient: currentUsername,
            timestamp: data.timestamp || new Date().toISOString(),
            type: 'game_history',
            gameData: data.gameData,
          };
          setMessages(prev => [...prev, newMessage]);
          return;
        }
        
        // Notifications de tournoi
        if (data.type === 'tournament_notification') {
          const newMessage = {
            sender: data.from || 'Tournament system',
            from: data.from,
            text: data.message || '',
            isPrivate: true,
            recipient: currentUsername,
            timestamp: data.timestamp || new Date().toISOString(),
            type: 'tournament_notification',
            tournamentName: data.tournamentName,
            roundNumber: data.roundNumber,
            nextOpponent: data.nextOpponent,
            allMatches: data.allMatches,
          };
          setMessages(prev => [...prev, newMessage]);
          return;
        }
        // Ajouter le nouveau message à la liste seulement si c'est un message privé
        if (data.isPrivate) {
          const newMessage = { 
            sender: data.username, 
            text: data.message,
            isPrivate: data.isPrivate,
            recipient: data.recipient,
            timestamp: new Date().toISOString(),
            type: data.type || undefined,
          };
          setMessages(prev => [...prev, newMessage]);
          // Gérer les notifications de messages non lus pour les messages privés
          if (data.username !== currentUsername && data.username !== selectedFriend) {
            incrementUnreadCount(data.username);
          }
        }
      }
    };

    socketRef.current.onerror = () => {
      setWsError(true);
      console.error('Error connexion WebSocket');
    };

    socketRef.current.onclose = () => {
      // console.log('WebSocket deconnected from chat server');
    };

    return () => {
      if (socketRef.current) {
		  socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected or not ready');
      return;
    }
    if (inputValue.trim() === '') return;
  
    const payload = { 
      message: selectedFriend ? `@${selectedFriend} ${inputValue}` : inputValue 
    };
    socketRef.current.send(JSON.stringify(payload));
    setInputValue('');
  };
  
  // Fonction pour sélectionner un ami et marquer ses messages comme lus
  const handleSelectFriend = (friendUsername: string) => {
    setSelectedFriend(friendUsername);
    markMessagesAsRead(friendUsername);
  };

  // Sélectionne automatiquement l'ami depuis l'URL ?user=xxx
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const user = params.get('user');
    if (user) {
      setSelectedFriend(user);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-black relative">
      <Sidebar />
      <main className="min-h-screen w-full relative">
        <div
          className="min-h-screen w-full bg-black bg-center bg-cover bg-no-repeat bg-fixed"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <h1 className="absolute top-4 left-1/2 -translate-x-1/2 md:top-5 md:left-20 md:translate-x-0 text-2xl md:text-4xl font-bold text-white px-4 md:px-6 py-2 rounded-full bg-gradient-to-r from-black/60 to-transparent z-20">
            Chat
          </h1>

          <div className="absolute top-16 left-0 right-0 bottom-0 md:top-20 md:left-20 md:right-20 md:bottom-20 flex items-center justify-center">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-2 sm:p-4 md:p-8 w-full max-w-full md:max-w-[1100px] border border-white/10 space-y-4 md:space-y-6 h-full md:h-auto flex flex-col">
              <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 h-full">
                {showFriends ? (
                  <div className="w-full md:w-[220px] flex-shrink-0 mb-4 md:mb-0">
                    <FriendSidebar
                      selectedFriend={selectedFriend}
                      setSelectedFriend={handleSelectFriend}
                      closeSidebar={() => setShowFriends(false)}
                      currentUserId={currentUserId || 0}
                      unreadCounts={unreadCounts}
                      setMessages={setMessages}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowFriends(true)}
                    className="text-white hover:text-green-500 transition duration-300"
                  >
                    <FaUserFriends />
                  </button>
                )}

                {showChat ? (
                  <div className="flex-1 min-w-0 flex flex-col">
                    <ChatSection
                      messages={messages}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      sendMessage={sendMessage}
                      selectedFriend={selectedFriend}
                      closeChat={() => setShowChat(false)}
                      isLoading={isLoading}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowChat(true)}
                    className="text-white hover:text-green-500 transition duration-300"
                  >
                    <FaPlay />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Modal bloquante stylisée */}
        {wsError && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="bg-gradient-to-br from-black/70 to-white/10 border border-white/10 backdrop-blur-md text-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md">
              <h2 className="text-2xl font-bold text-red-400 mb-4 text-center">Connexion WebSocket perdue</h2>
              <p className="text-sm text-gray-300 mb-6 text-center">
                You've been deconnected from chat server. Please reconnect to continue.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }}
                  className="px-5 py-2 bg-red-500 hover:bg-red-600 transition rounded-lg text-white font-semibold shadow-lg"
                >
                  Comeback to connexion
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;
