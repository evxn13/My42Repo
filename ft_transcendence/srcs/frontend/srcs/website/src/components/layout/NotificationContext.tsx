import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { MessageNotification } from '../../types/notifications';

interface NotificationContextType {
  notifications: MessageNotification[];
  addNotification: (notif: MessageNotification) => void;
  markAllAsRead: () => void;
  socketRef: React.MutableRefObject<WebSocket | null>;
  removeNotification: (index: number) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<MessageNotification[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const location = useLocation();

  // Fonction pour ajouter une notification
  const addNotification = (notif: MessageNotification) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  // Reset notifications quand on va sur /chat
  useEffect(() => {
    if (location.pathname.startsWith('/chat')) {
      markAllAsRead();
    }
  }, [location.pathname]);

  // WebSocket pour recevoir les messages privés (hors /chat)
  useEffect(() => {
    if (location.pathname.startsWith('/chat')) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;
    let currentUsername = '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUsername = payload.username;
    } catch {}
    // Utiliser WSS si HTTPS est activé pour le chat
    const wsProtocol = import.meta.env.VITE_CHAT_USE_HTTPS === 'true' ? 'wss' : 'ws';
    const wsPort = import.meta.env.VITE_CHAT_USE_HTTPS === 'true' 
      ? import.meta.env.VITE_PORT_CHAT_HTTPS 
      : import.meta.env.VITE_PORT_CHAT;
    
    const wsUrl = `wss://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/ws-chat?token=${token || ''}`;
    socketRef.current = new WebSocket(wsUrl);
    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Normal private messages
        if (data.isPrivate && data.username && data.username !== currentUsername) {
          addNotification({
            sender: data.username,
            text: data.message,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'message',
          });
        }
        
        // Game invitations
        if (data.type === 'game_invite' && data.from !== currentUsername) {
          addNotification({
            sender: data.from,
            text: data.message || `${data.from} invites you to join a game!`,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'game_invite',
            roomId: data.roomId,
          });
        }
        
        // Tournament notifications
        if (data.type === 'tournament_notification') {
          addNotification({
            sender: data.from || 'Tournament System',
            text: data.message || 'New tournament notification',
            timestamp: data.timestamp || new Date().toISOString(),
            read: false,
            type: 'tournament_notification',
            tournamentName: data.tournamentName,
            roundNumber: data.roundNumber,
            nextOpponent: data.nextOpponent,
            allMatches: data.allMatches,
          });
        }
      } catch {}
    };
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [location.pathname]);

  // Supprime une notification par index
  const removeNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  // Supprime toutes les notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead, socketRef, removeNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}; 