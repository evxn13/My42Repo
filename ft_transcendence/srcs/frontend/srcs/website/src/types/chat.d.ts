// Types pour les données de chat

export interface GameData {
  gameRoomName: string;
  gameEndReason: 'player victory' | 'player quit' | 'finished';
  clientDataArr: PlayerData[];
  roomId?: string;
}

export interface PlayerData {
  userDetails?: {
    username?: string;
  };
  points?: number;
  isVictory?: boolean;
}

export interface ChatMessage {
  sender: string;
  text: string;
  isPrivate?: boolean;
  recipient?: string;
  timestamp?: string;
  type?: 'message' | 'invite' | 'game_invite' | 'game_history' | 'tournament_notification';
  from?: string;
  roomId?: string;
  gameData?: GameData;
  tournamentName?: string;
  roundNumber?: number;
  nextOpponent?: string;
  allMatches?: string[];
}

export type MessageSetter = React.Dispatch<React.SetStateAction<ChatMessage[]>>; 