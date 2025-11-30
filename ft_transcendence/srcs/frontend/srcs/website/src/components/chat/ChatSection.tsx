// path: srcs/frontend/srcs/website/src/components/chat/ChatSection.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage, PlayerData } from '../../types/chat';

const ChatSection = ({
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    selectedFriend,
    closeChat,
    isLoading = false
} : {
    messages: ChatMessage[];
    inputValue: string;
    setInputValue: (value: string) => void;
    sendMessage: () => void;
    selectedFriend: string | null;
    closeChat: () => void;
    isLoading?: boolean;
}) => {
    const navigate = useNavigate();
	const [username, setUsername] = useState<string>('');
   
	const token = localStorage.getItem('token');
    const fetchProfile = async () => {
		try {
		const res = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/me`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});

        if (res.ok)
		{
			const caca = await res.json();
			const yuser = caca.user;
			setUsername(yuser.username);
		}
      } catch (err: any) {
        console.error("Erreur lors de la récupération du profil:", err);
      }
    };

    fetchProfile();
    // Filtrer les messages selon l'ami sélectionné
    const filteredMessages = selectedFriend
        ? messages.filter(msg => 
            // Afficher les messages privés avec l'ami sélectionné
            (msg.isPrivate && (msg.sender === selectedFriend || msg.recipient === selectedFriend)) ||
            // Toujours afficher les messages game_history et game_invite
            msg.type === 'game_history' || msg.type === 'game_invite'
          )
        : messages.filter(msg => !msg.isPrivate); // Afficher les messages publics si aucun ami sélectionné
    
    // Référence pour faire défiler automatiquement vers les nouveaux messages
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // Faire défiler vers le bas lorsque les messages changent
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [filteredMessages]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    
    // Formater la date pour l'affichage
    const formatTime = (timestamp: string) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex-1 flex flex-col space-y-2 sm:space-y-4 min-w-0">
            <div className="flex items-center">
                <h2 className="text-2xl font-bold text-white">
                    {selectedFriend ? `Chat with ${selectedFriend}` : 'Select a Friend'}
                </h2>
            </div>

            <div className="flex-1 min-h-[200px] max-h-[40vh] sm:max-h-[400px] overflow-y-auto bg-black/20 rounded-lg p-2 sm:p-4 space-y-2 sm:space-y-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <>
                        {filteredMessages.length === 0 && (
                            <div className="text-center text-white/50 italic py-8">
                                {selectedFriend 
                                    ? `No messages with ${selectedFriend}. Be the first to write!`
                                    : (
                                        <div className="space-y-4">
                                            <div className="text-xl">💬</div>
                                            <div>Choose a friend from the list to start a conversation</div>
                                            <div className="text-sm text-white/30">Your private messages will appear here</div>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                        {filteredMessages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex flex-col ${
                                    message.sender === selectedFriend ? 'items-start' : 'items-end'
                                }`}
                            >
                                {/* Invitation à une partie */}
                                {message.type === 'invite' || message.type === 'game_invite' ? (
                                    <div className="max-w-[90%] sm:max-w-[70%] bg-black/80 border border-green-500 rounded-xl p-4 flex items-center gap-4 shadow-lg animate-fade-in-up">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
                                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z"/></svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white font-semibold mb-1">
                                                {message.type === 'game_invite' 
                                                    ? `${message.from || message.sender} invites you to join a game!`
                                                    : `${message.sender} invites you to a game!`
                                                }
                                            </div>
                                            <div className="text-gray-400 text-xs mb-2">
                                                Invitation received at {formatTime(message.timestamp || '')}
                                                {(message.roomId || message.gameData?.roomId) && (
                                                    <div className="text-green-300 text-xs mt-1">Room: {message.roomId || message.gameData?.roomId}</div>
                                                )}
                                            </div>
											{message.recipient !== username && (
                                            <button 
                                                onClick={() => {
                                                    const roomId = message.roomId || message.gameData?.roomId;
                                                    if (roomId) {
                                                        // Rediriger vers la page de jeu avec l'ID de la room
                                                        navigate(`/game?joinRoom=${encodeURIComponent(roomId)}`);
                                                    } else {
                                                        // Ancienne logique pour les invitations sans room
                                                        navigate('/game/create');
                                                    }
                                                }}
                                                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-black font-bold shadow transition"
                                            >
                                                Join
                                            </button> 
											)}
                                        </div>
                                    </div>
                                ) : message.type === 'game_history' ? (
                                    /* Historique de jeu */
                                    <div className="max-w-[90%] sm:max-w-[70%] bg-black/80 border border-blue-500 rounded-xl p-4 shadow-lg animate-fade-in-up">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                                                🎮
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white font-semibold mb-2">
                                                    📊 Game Result
                                                </div>
                                                
                                                {/* Affichage détaillé si gameData est disponible */}
                                                {message.gameData && message.gameData.gameRoomName ? (
                                                    <div className="space-y-3">
                                                        <div className="text-blue-300 font-medium">
                                                            🏟️ {message.gameData.gameRoomName}
                                                        </div>
                                                        
                                                        {message.gameData.clientDataArr && message.gameData.clientDataArr.length > 0 && (
                                                            <div className="space-y-2">
                                                                <div className="text-gray-300 text-sm font-medium">Final Scores:</div>
                                                                {message.gameData.clientDataArr.map((player: PlayerData, index: number) => (
                                                                    <div key={index} className={`flex justify-between items-center p-2 rounded-lg ${
                                                                        player.isVictory ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
                                                                    }`}>
                                                                        <span className="text-white font-medium">
                                                                            {player.userDetails?.username || `Player ${index + 1}`}
                                                                        </span>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-white font-bold">
                                                                                {player.points || 0} pts
                                                                            </span>
                                                                            <span className="text-lg">
                                                                                {player.isVictory ? '🏆' : '💔'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        
                                                        <div className="text-gray-400 text-xs pt-2 border-t border-gray-600">
                                                            Game End: {message.gameData.gameEndReason === 'player victory' ? 'Victory' : 
                                                                            message.gameData.gameEndReason === 'player quit' ? 'Quit' : 'Finished'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* Fallback vers l'affichage texte si pas de gameData */
                                                    <div className="text-gray-300 text-sm whitespace-pre-line">
                                                        {message.text}
                                                    </div>
                                                )}
                                                
                                                <div className="text-gray-400 text-xs mt-2">
                                                    Received at {formatTime(message.timestamp || '')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                <div
                                    className={`max-w-[90%] sm:max-w-[70%] break-words rounded-lg px-3 sm:px-4 py-2 ${
                                        message.sender === selectedFriend
                                            ? 'bg-white/10 text-white'
                                            : 'bg-green-500 text-black'
                                    }`}
                                >
                                    <div className="text-sm font-semibold mb-1 flex justify-between">
                                        <span>{message.sender}</span>
                                        <span className="text-xs opacity-70 ml-2">
                                            {formatTime(message.timestamp || '')}
                                        </span>
                                    </div>
                                    <div>{message.text}</div>
                                </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                <div className="flex-1 relative">
                    <textarea
                        value={inputValue}
                        onChange={(e) => {
                            // Limiter strictement à 500 caractères
                            const newValue = e.target.value.slice(0, 500);
                            setInputValue(newValue);
                        }}
                        onPaste={(e) => {
                            // Gérer le copier-coller
                            e.preventDefault();
                            const pastedText = e.clipboardData.getData('text');
                            const currentText = inputValue;
                            const maxChars = 500;
                            const availableSpace = maxChars - currentText.length;
                            const textToAdd = pastedText.slice(0, availableSpace);
                            setInputValue(currentText + textToAdd);
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder={selectedFriend ? `Message ${selectedFriend}...` : 'Choose a friend to start chatting...'}
                        disabled={!selectedFriend}
                        maxLength={500}
                        className={`w-full bg-white/10 border border-white/20 rounded-lg p-3 sm:p-4 text-white resize-none focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 ${
                            !selectedFriend ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        rows={2}
                    />
                    <div className={`absolute bottom-2 right-2 text-xs ${
                        inputValue.length >= 450 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                        {inputValue.length}/500
                    </div>
                </div>
                <button
                    onClick={sendMessage}
                    disabled={!selectedFriend}
                    className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg transition duration-300 ${
                        selectedFriend 
                            ? 'bg-green-500 text-black hover:bg-green-600' 
                            : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    }`}
                >
                    Send
                </button>
            </div>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.35s cubic-bezier(.4,2,.6,1) both;
                }
            `}</style>
        </div>
    );
};

export default ChatSection;
