// **************************************************************************** //
//                                                                              //
//                                                         :::      ::::::::    //
//    GameSummary.tsx                                    :+:      :+:    :+:    //
//                                                     +:+ +:+         +:+      //
//    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         //
//                                                 +#+#+#+#+#+   +#+            //
//    Created: 2025/05/22 17:46:01 by isibio            #+#    #+#              //
//    Updated: 2025/05/22 17:46:02 by isibio           ###   ########.fr        //
//                                                                              //
// **************************************************************************** //

import React, { useEffect, useState }	from 'react';
import GameSummaryWS			from '/lib/transcendence/wsCommunicationsJS/event/GameSummaryWS.js';
import axiosClient from '../../account/utils/axiosClient';

// Interface minimale pour les données des joueurs
interface PlayerData {
	points: number;
	userDetails: { userId: string };
	isVictory: boolean;
}

// Interface minimale pour l'objet backendObject
interface GameSummaryProps {
	backendObject?: {
		gameEndReason: string;
		gameRoomName: string;
		clientDataArr?: PlayerData[];
	};
}

export const GameSummary: React.FC<GameSummaryProps> = ({ backendObject }) => 
{
	if (backendObject === undefined)
		return (null);

	const [summary, setSummary] = useState<string>('');

	// Fonction pour envoyer l'historique de la partie dans le chat via API REST
	const sendGameHistoryToChat = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				console.log('❌ No token found');
				return;
			}

			// Créer le message de résumé de la partie
			const gameResult = await formatGameSummary(backendObject);
			// Récupérer le nom d'utilisateur actuel depuis le token
			let currentUsername = '';
			try {
				const payload = JSON.parse(atob(token.split('.')[1]));
				currentUsername = payload.username;
			} catch (e) {
				console.error('❌ Error decode token:', e);
				return;
			}

			// Envoyer l'historique via API REST (HTTPS si configuré)
			const response = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/req/game-history`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					type: 'game_history',
					to: currentUsername,
					message: gameResult,
					gameData: backendObject
				})
			});

			if (response.ok) {
				console.log('✅ Game history send with success with API REST');
			} else {
				console.error('❌ Error while sending history:', response.status, response.statusText);
			}
		} catch (error) {
			console.error('❌ Error while sending game history:', error);
		}
	};

	// Fonction pour formater le résumé de la partie
	const formatGameSummary = async (gameData: GameSummaryProps['backendObject']) => {
		if (!gameData) return '';
		const roomName = gameData.gameRoomName || 'Unknown game';
		const endReason = getMessage();
		let summary = '';

		if (gameData.clientDataArr && gameData.clientDataArr.length > 0) {
			const results = await Promise.all(
				gameData.clientDataArr.map(async (player: PlayerData, index) => {
					const res = await axiosClient.get('/meID', { params: { userId: player.userDetails.userId } });
					let username: string;
					if (res.data.success)
						username = res.data.user.username;
					else
						username = `Player ${index + 1}`;
					const points = player.points || 0;
					const status = player.isVictory ? '🏆 Victory' : '💔 Defeat';
					return `• ${username}: ${points} points ${status}\n`;
				})
			);
			summary += results.join('');
		}
		setSummary(summary);
		return summary;		
	};

	const getMessage = () => {
		switch (backendObject.gameEndReason) {
			case GameSummaryWS.gameEndPlayerVictory:
				return "A WIN IS A WIN";
			case GameSummaryWS.gameEndPlayerQuit:
				return "I Guess We'll never know";
			case GameSummaryWS.gameEndPlayersNotUnique:
				return "I hate being Bi-Polar it's awesome";
			case GameSummaryWS.gameEndNoReason:
			default:
				return "RageQuittBait";
		}
	};

	// Envoyer l'historique automatiquement quand le composant s'affiche
	useEffect(() => {
				// Toujours essayer d'envoyer l'historique, mais ne pas bloquer l'affichage
		sendGameHistoryToChat().catch(error => {
			console.error('❌ Error while sending history:', error);
		});
	}, [backendObject]);

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
			<div className="bg-white/10 border-2 border-white/50 rounded-xl p-8 text-center">
				<h1 className="text-4xl font-bold text-white mb-4">{getMessage()}</h1>
				<div className="text-white/80 text-xl">
					{backendObject.gameRoomName}
				</div>
				{summary && (
					<div className="mt-6 space-y-2 text-white/90 text-lg whitespace-pre-line">
						{summary}
					</div>
				)}
			</div>
		</div>
	);
};

// export default GameSummary;
