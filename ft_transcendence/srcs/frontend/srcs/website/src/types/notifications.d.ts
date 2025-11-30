export interface MessageNotification {
  sender: string;
  text: string;
  timestamp: string;
  read: boolean;
  type?: 'message' | 'game_invite' | 'game_history' | 'tournament_notification';
  roomId?: string;
  gameData?: any;
  tournamentName?: string;
  roundNumber?: number;
  nextOpponent?: string;
  allMatches?: string[];
} 