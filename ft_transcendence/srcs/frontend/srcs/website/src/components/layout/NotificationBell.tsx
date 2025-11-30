import { useState, useRef, useEffect } from 'react';
import { FaBell, FaPaperPlane, FaTrash, FaTrashAlt, FaComments, FaTrophy } from 'react-icons/fa';
import { useNotification } from './NotificationContext';
import { useNavigate } from 'react-router-dom';

const ANIMATION_DURATION = 600; // ms

const NotificationBell = () => {
  const { notifications, markAllAsRead, socketRef, removeNotification, clearNotifications } = useNotification();
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState<{ [sender: string]: string }>({});
  const [sending, setSending] = useState<{ [sender: string]: boolean }>({});
  const [deleting, setDeleting] = useState<number[]>([]); // index des notifs en suppression
  const [deletingAll, setDeletingAll] = useState(false);
  const [friends, setFriends] = useState<{ id: number, username: string }[]>([]);
  const bellRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Récupérer la liste des amis avec la nouvelle route sécurisée
  useEffect(() => {
    const fetchFriends = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // console.log('NotificationBell: Aucun token trouvé');
        return;
      }

      try {
        const response = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/friends`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // console.log('response not OK');
          setFriends([]);
          return;
        }

        const data = await response.json();
        setFriends(Array.isArray(data) ? data : []);
      } catch (error) {
        // console.log('NotificationBell: Erreur lors de la récupération des amis:');
        setFriends([]);
      }
    };

    fetchFriends();
  }, [open]);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifClick = (notif: any) => {
    setOpen(false);
    markAllAsRead();

    if (notif.type === 'game_invite' && notif.roomId) {
      // Rediriger vers la page de jeu pour rejoindre la room
      navigate(`/game?joinRoom=${encodeURIComponent(notif.roomId)}`);
    } else if (notif.type === 'game_history') {
      // Rediriger vers le chat pour voir l'historique
      navigate('/chat');
    } else if (notif.type === 'tournament_notification') {
      // Pas d'action pour les notifications de tournoi - le joueur est déjà dedans
      return;
    } else {
      // Message normal - ouvrir le chat avec l'utilisateur
      navigate(`/chat?user=${encodeURIComponent(notif.sender)}`);
    }
  };

  // Envoi réel du message via WebSocket
  const handleReply = async (key: string) => {
    // Extraire le vrai username depuis la clé
    let username = key;
    if (key.startsWith('notif-')) username = key.replace('notif-', '');
    if (key.startsWith('friend-')) username = key.replace('friend-', '');

    if (!reply[key] || reply[key].trim() === '') return;
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      alert('Connexion au chat non disponible.');
      return;
    }
    setSending((prev) => ({ ...prev, [key]: true }));
    const payload = {
      message: `@${username} ${reply[key]}`
    };
    socketRef.current.send(JSON.stringify(payload));
    setReply((prev) => ({ ...prev, [key]: '' }));
    setTimeout(() => setSending((prev) => ({ ...prev, [key]: false })), 500);
  };

  // Animation suppression individuelle
  const handleDelete = (idx: number) => {
    setDeleting((prev) => [...prev, idx]);
    setTimeout(() => {
      removeNotification(idx);
      setDeleting((prev) => prev.filter(i => i !== idx));
    }, ANIMATION_DURATION);
  };

  // Animation suppression en cascade
  const handleDeleteAll = () => {
    setDeletingAll(true);
    notifications.forEach((_, idx) => {
      setTimeout(() => {
        setDeleting((prev) => [...prev, idx]);
      }, idx * 120);
    });
    setTimeout(() => {
      clearNotifications();
      setDeleting([]);
      setDeletingAll(false);
    }, ANIMATION_DURATION + notifications.length * 120);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50" ref={bellRef}>
      <button
        className="relative p-3 rounded-full bg-black/60 hover:bg-black/80 transition-all shadow-xl backdrop-blur-md"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        <FaBell style={{ color: '#1DB954' }} className="animate-bounce text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 animate-pulse shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 bottom-14 mb-2 w-80 max-w-[90vw] bg-black/80 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in-up">
          <div className="p-4 border-b border-white/10 text-white font-semibold tracking-wide flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2"><FaBell style={{ color: '#1DB954' }} className="animate-bounce" /> Messages</span>
            {notifications.length > 0 && (
              <button
                className="ml-auto p-2 rounded-full bg-white/10 hover:bg-red-500/80 text-white hover:text-white transition shadow-sm"
                title="Delete all notifications"
                onClick={handleDeleteAll}
                disabled={deletingAll}
              >
                <FaTrashAlt />
              </button>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 && (
              <li className="p-4 text-gray-400 text-center">No messages</li>
            )}
            {notifications.map((notif, idx) => (
              <li
                key={idx}
                className={`group px-4 py-3 transition flex flex-col gap-1 border-b border-white/5 last:border-b-0 ${!notif.read ? 'bg-green-900/20' : 'hover:bg-white/10'} hover:scale-[1.02] hover:shadow-lg cursor-pointer relative animate-fade-in-up ${deleting.includes(idx) ? 'animate-slide-out' : ''}`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Individual delete button */}
                <button
                  className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-red-500/80 text-white hover:text-white transition shadow-sm z-10"
                  title="Delete this notification"
                  onClick={e => { e.stopPropagation(); handleDelete(idx); }}
                  disabled={deletingAll}
                >
                  <FaTrash size={12} />
                </button>
                <div className="flex items-center gap-2 pr-6">
                  <span className="font-bold" style={{ color: '#1DB954', textShadow: '0 0 2px #1DB95488' }}>{notif.sender}</span>
                  {notif.type === 'game_invite' && <span className="text-xs bg-green-500 text-black px-2 py-1 rounded-full">🎮 Invitation</span>}
                  {notif.type === 'game_history' && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">📊 Result</span>}
                  {notif.type === 'tournament_notification' && <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">🏆 Tournament</span>}
                  <span className="text-xs text-gray-400 ml-auto">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                </div>
                <span className="text-white text-sm truncate mb-1">{notif.text}</span>
                {notif.type === 'tournament_notification' && notif.nextOpponent && (
                  <div className="text-xs text-yellow-300 mt-1">
                    Next opponent: <span className="font-semibold">{notif.nextOpponent}</span>
                  </div>
                )}
                <div className="flex gap-2 mt-1">
                  <button
                    className="text-xs text-green-500 hover:underline hover:text-green-600 transition"
                    onClick={() => handleNotifClick(notif)}
                  >
                    {notif.type === 'game_invite' ? 'Join game' :
                      notif.type === 'game_history' ? 'View result' :
                        notif.type === 'tournament_notification' ? '' :
                          ''}
                  </button>
                </div>
                {/* Inline reply field for unread notifications (except game and tournament) */}
                {!notif.read && notif.type !== 'game_invite' && notif.type !== 'game_history' && notif.type !== 'tournament_notification' && (
                  <form
                    className="flex items-center gap-2 mt-2 animate-fade-in"
                    onSubmit={e => { e.preventDefault(); handleReply('notif-' + notif.sender); }}
                  >
                    <input
                      type="text"
                      className="flex-1 px-3 py-1 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400 text-sm transition"
                      placeholder={`Reply to ${notif.sender}...`}
                      value={reply['notif-' + notif.sender] || ''}
                      onChange={e => setReply(r => ({ ...r, ['notif-' + notif.sender]: e.target.value }))}
                      disabled={sending['notif-' + notif.sender] || deletingAll}
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-black shadow-md transition disabled:opacity-60"
                      disabled={sending['notif-' + notif.sender] || !(reply['notif-' + notif.sender] && reply['notif-' + notif.sender].trim()) || deletingAll}
                    >
                      <FaPaperPlane size={14} />
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
          {/* Friends list to start a conversation */}
          <div className="border-t border-white/10 bg-black/70 p-3">
            <div className="text-white text-sm font-semibold mb-2 flex items-center gap-2"><FaComments /> Start a conversation</div>
            {friends.length === 0 ? (
              <div className="text-gray-400 text-xs">No friends</div>
            ) : (
              <ul className="space-y-2">
                {friends.map(friend => (
                  <li key={friend.id} className="flex flex-col gap-1 py-1 px-2 rounded hover:bg-white/10 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-400">{friend.username}</span>
                    </div>
                    <form
                      className="flex items-center gap-2 mt-1"
                      onSubmit={e => {
                        e.preventDefault();
                        if (!reply['friend-' + friend.username] || reply['friend-' + friend.username].trim() === '') return;
                        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
                          alert('Chat connection not available.');
                          return;
                        }
                        setSending((prev) => ({ ...prev, ['friend-' + friend.username]: true }));
                        const payload = {
                          message: `@${friend.username} ${reply['friend-' + friend.username]}`
                        };
                        socketRef.current.send(JSON.stringify(payload));
                        setReply((prev) => ({ ...prev, ['friend-' + friend.username]: '' }));
                        setTimeout(() => setSending((prev) => ({ ...prev, ['friend-' + friend.username]: false })), 500);
                      }}
                    >
                      <input
                        type="text"
                        className="flex-1 px-3 py-1 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400 text-sm transition"
                        placeholder={`Send a message to ${friend.username}...`}
                        value={reply['friend-' + friend.username] || ''}
                        onChange={e => setReply(r => ({ ...r, ['friend-' + friend.username]: e.target.value }))}
                        disabled={sending['friend-' + friend.username] || deletingAll}
                      />
                      <button
                        type="submit"
                        className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-black shadow-md transition disabled:opacity-60"
                        disabled={sending['friend-' + friend.username] || !(reply['friend-' + friend.username] && reply['friend-' + friend.username].trim()) || deletingAll}
                        title={`Send to ${friend.username}`}
                      >
                        <FaPaperPlane size={14} />
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {/* Animations CSS */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.35s cubic-bezier(.4,2,.6,1) both;
        }
        @keyframes slide-out {
          to { opacity: 0; transform: translateX(60px) scale(0.95); height: 0; margin: 0; padding: 0; }
        }
        .animate-slide-out {
          animation: slide-out 600ms cubic-bezier(.4,2,.6,1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2226;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default NotificationBell; 