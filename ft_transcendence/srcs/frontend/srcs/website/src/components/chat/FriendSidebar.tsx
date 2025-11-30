// srcs/frontend/srcs/website/src/components/chat/FriendSidebar.tsx
import { FaCompressAlt, FaBan, FaUndo, FaEllipsisV, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../layout/NotificationContext';
import { addLocalInviteMessage } from '../../pages/Chat';
import { MessageSetter } from '../../types/chat';
import https				from 'https';

interface Friend {
  id: number;
  username: string;
  status: string;
  created_at: string;
  connection_status: 'online' | 'offline';
  last_seen: string;
  time_since_last_seen: string | null;
}

interface PendingFriend {
  id: number;
  user_id: number;
  friend_id: number;
  friend_username: string;
  status: string;
  created_at: string;
}

interface BlockedUser {
  id: number;
  blocked_id: number;
  blocked_username: string;
  created_at: string;
}

interface DropdownState {
  [friendId: number]: boolean;
}

const FriendSidebar = ({
  selectedFriend,
  setSelectedFriend,
  closeSidebar,
  currentUserId,
  unreadCounts = {},
  setMessages
}: {
  selectedFriend: string | null;
  setSelectedFriend: (friend: string) => void;
  closeSidebar: () => void;
  currentUserId: number;
  unreadCounts?: Record<string, number>;
  setMessages?: MessageSetter;
}) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingFriends, setPendingFriends] = useState<PendingFriend[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [newFriend, setNewFriend] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showBlocked, setShowBlocked] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({});
  const { socketRef } = useNotification();
  const navigate = useNavigate();

  // Fonction pour effacer les messages après un délai
  const clearMessages = () => {
    setTimeout(() => {
      setError(null);
      setSuccessMessage(null);
    }, 5000); // 5 secondes
  };

  // Charger la liste des amis et des demandes en attente
  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
	  const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Récupérer les amis acceptés
        const friendsResponse = await fetch(
          `https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/friends`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        if (!friendsResponse.ok) throw new Error('Error loading friends');
        const friendsData = await friendsResponse.json();
		const updatedFriendsData = await Promise.all(friendsData.map(async friend => {
			const userData = await fetch(
				`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/you/${friend.username}`,
			);
			const jsonUserData = await userData.json();
			const user = jsonUserData.user;

			friend.connection_status = user.is_online ? 'online' : 'false';
			return friend;
		}));
		setFriends(updatedFriendsData);

        // Récupérer les demandes d'amis en attente
        const pendingResponse = await fetch(
          `https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/friends/pending`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        if (!pendingResponse.ok) throw new Error('Error loading pending requests');
        const pendingData = await pendingResponse.json();
        setPendingFriends(pendingData);

        // Récupérer les utilisateurs bloqués
        const blockedResponse = await fetch(
          `https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/blocked`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        if (!blockedResponse.ok) throw new Error('Error loading blocked users');
        const blockedData = await blockedResponse.json();
        setBlockedUsers(blockedData);
      } catch (err) {
        setError('Error loading friends');
        console.error(err);
      }
    };

    if (currentUserId) fetchFriendsAndRequests();
  }, [currentUserId]);

  // Accepter une demande d'ami
  const acceptFriendRequest = async (requestId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication required");
      return;
    }

    try {
      const response = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/friends/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error accepting friend request');
      }

      // Recharger les listes après l'acceptation
      if (token) {
        const friendsResponse = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/friends`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      const friendsData = await friendsResponse.json();
      setFriends(friendsData);

        const pendingResponse = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/friends/pending`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      const pendingData = await pendingResponse.json();
      setPendingFriends(pendingData);
      }

      setError(null);
    } catch (err) {
      setError('Error accepting friend request');
      console.error(err);
    }
  };

  // Ajouter un ami
  const addFriend = async () => {
    if (!newFriend.trim()) {
      setError("Please enter a username");
      setSuccessMessage(null);
      clearMessages();
      return;
    }

    try {
      // D'abord, chercher l'ID de l'utilisateur par son nom (conversion en minuscules)
      const userResponse = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/you/${newFriend.toLowerCase()}`);
      const resData = await userResponse.json();

      if (!resData.user) {
        setError("This user doesn't exist");
        setSuccessMessage(null);
        clearMessages();
        return;
      }
	  const friendUser = resData.user;

      if (friendUser.id === currentUserId) {
        setError("You cannot add yourself as a friend");
        setSuccessMessage(null);
        clearMessages();
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication required");
        setSuccessMessage(null);
        clearMessages();
        return;
      }

      const response = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/friendsAdd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          friend_id: friendUser.id
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Error adding friend");
        setSuccessMessage(null);
        clearMessages();
        return;
      }

      // Afficher le message de succès
      setSuccessMessage(data.message || "Friend request sent successfully!");
      setNewFriend('');
      setError(null);
      clearMessages();
      
      // Recharger les listes
      if (token) {
        const friendsResponse = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/friends`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      const friendsData = await friendsResponse.json();
      setFriends(friendsData);

        const pendingResponse = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/friends/pending`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      const pendingData = await pendingResponse.json();
      setPendingFriends(pendingData);
      }
    } catch (err) {
      setError("Error adding friend. Please try again.");
      setSuccessMessage(null);
      clearMessages();
      console.error(err);
    }
  };

  // Bloquer un utilisateur
  const blockUser = async (friendId: number, friendUsername: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication required");
      return;
    }

    try {
      const response = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          blocked_id: friendId
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Error blocking user");
        return;
      }

      // Recharger les listes après le blocage
      const blockedResponse = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/blocked`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const blockedData = await blockedResponse.json();
      setBlockedUsers(blockedData);

      // Recharger aussi la liste des amis pour retirer l'utilisateur bloqué
      const friendsResponse = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/friends`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const friendsData = await friendsResponse.json();
      setFriends(friendsData);

      // Si l'utilisateur bloqué était sélectionné, le désélectionner
      if (selectedFriend === friendUsername) {
        setSelectedFriend('');
      }

      setError(null);
    } catch (err) {
      setError("Error blocking user");
      console.error(err);
    }
  };

  // Débloquer un utilisateur
  const unblockUser = async (blockedId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication required");
      return;
    }

    try {
      const response = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/block/${blockedId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Error unblocking user");
        return;
      }

      // Recharger la liste des utilisateurs bloqués
      const blockedResponse = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/blocked`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const blockedData = await blockedResponse.json();
      setBlockedUsers(blockedData);

      // Recharger aussi la liste des amis pour faire réapparaître l'utilisateur débloqué s'il était ami
      const friendsResponse = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/friends`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const friendsData = await friendsResponse.json();
      setFriends(friendsData);

      setError(null);
    } catch (err) {
      setError("Error unblocking user");
      console.error(err);
    }
  };

  // Gérer l'ouverture/fermeture du dropdown pour chaque ami
  const toggleDropdown = (friendId: number) => {
    setDropdownOpen((prev) => ({ ...prev, [friendId]: !prev[friendId] }));
  };
  const closeDropdown = (friendId: number) => {
    setDropdownOpen((prev) => ({ ...prev, [friendId]: false }));
  };

  // Pour obtenir le nom d'utilisateur courant
  let currentUsername = '';
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUsername = payload.username;
    } catch {}
  }

  return (
    <div className="w-full md:w-[200px] bg-black/30 backdrop-blur-sm rounded-2xl p-3 sm:p-6 border border-white/10 animate-fade-in max-h-[60vh] md:max-h-none overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Friends</h2>
        <button
          onClick={closeSidebar}
          className="text-white hover:text-red-500 transition duration-300"
        >
          <FaCompressAlt />
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-4 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="text-green-500 mb-4 text-sm">
          {successMessage}
        </div>
      )}

      {/* Demandes d'amis en attente */}
      {pendingFriends.length > 0 && (
        <div className="mb-6">
          <h3 className="text-white text-lg font-semibold mb-2">Pending Requests</h3>
          <div className="space-y-2">
            {pendingFriends.map((request) => (
              <div key={request.id} className="bg-white/10 rounded-lg p-3">
                <p className="text-white text-sm mb-2">{request.friend_username}</p>
                <button
                  onClick={() => acceptFriendRequest(request.id)}
                  className="w-full px-3 py-1 bg-green-500 text-black text-sm rounded hover:bg-green-600 transition duration-300"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des amis */}
      <div className="space-y-2 sm:space-y-4">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className={`p-4 bg-white/10 rounded-lg text-white cursor-pointer hover:bg-white/20 transition duration-300 relative ${
              selectedFriend === friend.username ? 'bg-white/20' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center space-x-3 flex-1"
                onClick={() => setSelectedFriend(friend.username)}
              >
                {/* Indicateur de statut */}
                <div className={`w-3 h-3 rounded-full ${
                  friend.connection_status === 'online' 
                    ? 'bg-green-500 animate-pulse' 
                    : 'bg-gray-500'
                }`}></div>
                
                <div>
                  <div className="font-medium">{friend.username}</div>
                  <div className={`text-xs ${
                    friend.connection_status === 'online' 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {friend.connection_status === 'online' 
                      ? 'Online' 
                      : 'Offline'
                    }
                  </div>
                </div>
              </div>
              
              {/* Bouton menu dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(friend.id);
                  }}
                  className="p-1 text-white/70 hover:text-white transition duration-300"
                  title="Options"
                >
                  <FaEllipsisV size={16} />
                </button>
                {dropdownOpen[friend.id] && (
                  <div
                    className="absolute right-0 mt-2 w-36 bg-black border border-white/10 rounded-lg shadow-lg z-50 animate-fade-in"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        navigate(`/profil/${friend.username}`);
                        closeDropdown(friend.id);
                      }}
                      className="flex items-center w-full px-4 py-2 text-blue-400 hover:bg-blue-500/10 hover:text-blue-500 transition duration-200 text-sm rounded-t-lg"
                    >
                      <svg className="mr-2" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        // Rediriger vers la page de création de room avec le nom de l'ami invité
                        navigate(`/game/create?invitedPlayer=${friend.username}`);
                        closeDropdown(friend.id);
                      }}
                      className="flex items-center w-full px-4 py-2 text-green-400 hover:bg-green-500/10 hover:text-green-500 transition duration-200 text-sm"
                    >
                      <svg className="mr-2" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z"/></svg>
                      Invite to Game
                    </button>
                    <button
                      onClick={() => {
                        blockUser(friend.id, friend.username);
                        closeDropdown(friend.id);
                      }}
                      className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-500 transition duration-200 text-sm rounded-b-lg"
                    >
                      <FaBan className="mr-2" /> Block Friend
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Bulle de notification pour les messages non lus */}
            {unreadCounts[friend.username] > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
                {unreadCounts[friend.username] > 99 ? '99+' : unreadCounts[friend.username]}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Utilisateurs bloqués */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white text-lg font-semibold">Blocked Users</h3>
          <button
            onClick={() => setShowBlocked(!showBlocked)}
            className="text-white/70 hover:text-green-400 transition duration-200 p-1 rounded-full focus:outline-none"
            aria-label={showBlocked ? "Hide blocked users" : "Show blocked users"}
          >
            {showBlocked ? <FaChevronDown size={18} /> : <FaChevronRight size={18} />}
          </button>
        </div>
        
        {showBlocked && (
          <div className="space-y-2">
            {blockedUsers.length === 0 ? (
              <p className="text-gray-400 text-sm">No blocked users</p>
            ) : (
              blockedUsers.map((blockedUser) => (
                <div key={blockedUser.id} className="bg-red-900/20 rounded-lg p-3 border border-red-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{blockedUser.blocked_username}</p>
                      <p className="text-gray-400 text-xs">
                        Blocked on {new Date(blockedUser.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => unblockUser(blockedUser.blocked_id)}
                      className="p-2 text-green-400 hover:text-green-300 transition duration-300"
                      title="Unblock this user"
                    >
                      <FaUndo size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Ajouter un ami */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Add a new friend..."
          value={newFriend}
          onChange={(e) => setNewFriend(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 hover:bg-white/20 hover:backdrop-blur-md transition duration-300"
        />
        <button
          onClick={addFriend}
          className="mt-2 w-full px-3 sm:px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-green-500 hover:text-black hover:backdrop-blur-md transition duration-300"
        >
          Add Friend
        </button>
      </div>
    </div>
  );
};

export default FriendSidebar;
