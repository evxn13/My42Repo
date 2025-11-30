/* **************************************************************************** */
/*                                                                              */
/*                                                         :::      ::::::::    */
/*    game.tsx                                           :+:      :+:    :+:    */
/*                                                     +:+ +:+         +:+      */
/*    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         */
/*                                                 +#+#+#+#+#+   +#+            */
/*    Created: 2025/03/07 09:45:57 by isibio            #+#    #+#              */
/*    Updated: 2025/03/07 09:45:58 by isibio           ###   ########.fr        */
/*                                                                              */
/* **************************************************************************** */

import Sidebar										from '../../website/src/components/layout/Sidebar';
import backgroundImage								from '../../website/src/assets/Background-Game.jpg';
import { FaUserFriends, FaRobot, FaTrophy }			from 'react-icons/fa';
import { Link, useLocation, useNavigate }			from "react-router-dom";
import { AiFillCodepenCircle } from "react-icons/ai";

import { BackendWsContext }	from '../context/BackendWsContext.tsx';
import MatchmakingEventWS	from '/lib/transcendence/wsCommunicationsJS/event/MatchmakingEventWS.js';
import JoinRoomEventWS from '/lib/transcendence/wsCommunicationsJS/event/JoinRoomEventWS.js';

import { useContext }		from 'react';
import { useEffect, useState }		from 'react';
import React				from 'react';

const GamePage: React.FC = () => {
	const [renderMap, sendMessageToGameBackendWs] = useContext(BackendWsContext);
	const [roomId, setRoomId] = useState('');
	const [isJoining, setIsJoining] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const [roomNotFound, setRoomNotFound] = useState(false);

	// Vérifier si une room doit être rejointe automatiquement
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const joinRoomId = params.get('joinRoom');
		if (joinRoomId) {
			setRoomId(joinRoomId);
			setIsJoining(true);
			// Rejoindre automatiquement la room après un court délai
			setTimeout(() => {
				handleJoinRoom(joinRoomId);
			}, 1000);
		}
	}, [location.search]);

	const handleJoinRoom = (roomIdToJoin = roomId): void => {
		console.log("Trying to join the room with ID:", roomIdToJoin);
		
		// Réinitialiser l'état d'erreur
		setRoomNotFound(false);
		
		// Vérifier que roomIdToJoin est une chaîne valide
		if (roomIdToJoin && typeof roomIdToJoin === 'string' && roomIdToJoin.trim()) {
			const joinRoomEvent = new JoinRoomEventWS(roomIdToJoin);
			const jsonMessage = joinRoomEvent.createJSON();
			
			sendMessageToGameBackendWs(jsonMessage);
			
			// Rediriger vers la page de jeu principal
			navigate('/game/main');
		} else {
			console.log("Room ID invalid or empty");
		}
	};

	const handleRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		// console.log("Nouvelle valeur de l'input:", e.target.value);
		setRoomId(e.target.value);
	};

	return (
		<div className="min-h-screen w-full" style={{ backgroundColor: '#000' }}>
			<Sidebar />
			<div 
				className="min-h-screen w-full relative overflow-y-auto"
				style={{ 
					backgroundImage: `url(${backgroundImage})`,
					backgroundPosition: 'center -100px',
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
					backgroundAttachment: 'fixed',
					backgroundColor: '#000',
					paddingTop: '80px' // Ajoute un padding pour compenser le titre fixe
				}}
			>
				{/* Titre */}
				<div className="fixed top-5 left-20 z-10">
					<h1 className="text-4xl font-bold text-white px-6 py-2 rounded-full bg-gradient-to-r from-black/60 to-transparent">
						Game
					</h1>
				</div>
				{/* Conteneur pour tous les modes de jeu */}
				<div
					style={{
						marginTop: '50px', // Réduit car déjà un paddingTop sur le parent
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '50px',
						padding: '0 20px',
						position: 'relative',
						zIndex: 1,
						paddingBottom: '50px' // padding en bas pour éviter que le contenu soit coupé
					}}
				>
					{/* Section Matchmaking seule et plus grande */}
					<Link to="/game/main" state={{ doMatchmaking: true, matchmakingMode: MatchmakingEventWS.againstPlayer }}>
					<div
						style={{ 
							width: '700px',
							height: '120px'
						}}
						className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/30 flex items-center justify-center"
					>
						<div className="flex items-center justify-center w-full gap-x-4 px-4">
							<div className="flex-shrink-0">
								<FaUserFriends className="w-8 text-5xl text-white group-hover:scale-110 transition-transform duration-300" />
							</div>
							<div className="flex flex-col items-center justify-center flex-grow">
								<h2 className="text-2xl font-bold text-white text-center mb-4">
									Matchmak**g in Paris
								</h2>
							</div>
						</div>
					</div>
					</Link>

					{/* Ligne avec les deux autres modes */}
					<div
						className='flex flex-row flex-wrap justify-center gap-x-10 gap-y-5 w-full'
					>
						{/* Mode Solo vs IA */}
						<Link to="/game/createai" state={{ doMatchmaking: true, matchmakingMode: MatchmakingEventWS.againstAi }}>
							<div
								style={{
									width: '330px',
									height: '120px'
								}}
								className="bg-black/30 backdrop-blur-sm rounded-2xl p-3 hover:scale-105 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/30 flex items-center justify-center"
							>
								<div className="flex items-center justify-center w-full gap-x-4 px-4">
									<div className="flex-shrink-0">
										<FaRobot className="w-6 text-3xl text-white group-hover:scale-110 transition-transform duration-300" />
									</div>
									<div className="flex flex-col items-center justify-center flex-grow">
										<h2 className="text-lg font-bold text-white text-center">
											Solo vs IA** in Paris
										</h2>
									</div>
								</div>
							</div>
						</Link>

						{/* Mode Tournoi */}
						<Link to="/game/create">
							<div
								style={{
									width: '330px',
									height: '120px'
								}}
								className="bg-black/30 backdrop-blur-sm rounded-2xl p-3 hover:scale-105 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/30 flex items-center justify-center"
							>
								<div className="flex items-center justify-center w-full gap-x-4 px-4">
									<div className="flex-shrink-0">
										<AiFillCodepenCircle className="w-6 text-3xl text-white group-hover:scale-110 transition-transform duration-300" />
									</div>
									<div className="flex flex-col items-center justify-center flex-grow">
										<h2 className="text-lg font-bold text-white text-center">
											Create** Game in Paris
										</h2>
									</div>
								</div>
							</div>
						</Link>

						{/* Forcer un retour à la ligne*/}
						<div className="w-full hidden sm:block opacity-0"></div>

						{/* Section test */}
						<Link to="/game/tournament">
							<div
								style={{
									width: '330px',
									height: '120px'
								}}
								className="bg-black/30 backdrop-blur-sm rounded-2xl p-3 hover:scale-105 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/30 flex items-center justify-center"
							>
								<div className="flex items-center justify-center w-full gap-x-4 px-4">
									<div className="flex-shrink-0">
										<FaTrophy className="w-6 text-3xl text-white group-hover:scale-110 transition-transform duration-300" />
									</div>
									<div className="flex flex-col items-center justify-center flex-grow">
										<h2 className="text-lg font-bold text-white text-center">
											Create Tourna**nt in Paris
										</h2>
									</div>
								</div>
							</div>
						</Link>
										

						{/* Nouvelle section */}
						<Link to="/game/main" state={{ doMatchmaking: true, matchmakingMode: MatchmakingEventWS.tournament, isTournament: true }}>
							<div
								style={{
									width: '330px',
									height: '120px'
								}}
								className="bg-black/30 backdrop-blur-sm rounded-2xl p-3 hover:scale-105 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/30 flex items-center justify-center"
							>
								<div className="flex items-center justify-center w-full gap-x-4 px-4">
									<div className="flex-shrink-0">
										<FaTrophy className="w-6 text-3xl text-white group-hover:scale-110 transition-transform duration-300" />
									</div>
									<div className="flex flex-col items-center justify-center flex-grow">
										<h2 className="text-lg font-bold text-white text-center">
											Join Tourna**ment in Paris
										</h2>
									</div>
								</div>
							</div>
						</Link>
					</div>

					{/* Section pour rejoindre un tournoi spécifique */}
					<div
						style={{
							width: '100%',
							maxWidth: '500px',
							minHeight: '80px',
							marginTop: '20px'
						}}
						className={`bg-black/30 backdrop-blur-sm rounded-2xl pb-8 p-4 border ${isJoining ? 'border-green-500/50 bg-green-500/10' : 'border-white/10'}`}
					>
						<div className="flex flex-col items-center justify-center w-full">
							<h2 className={`text-lg font-bold text-center mb-3 ${isJoining ? 'text-green-300' : 'text-white'}`}>
								{isJoining ? '🎮 Connexion to the room...' : 'Join a room (-18)'}
							</h2>
							{isJoining && (
								<div className="text-green-200 text-sm mb-3">
									Room ID: {roomId}
								</div>
							)}
							<div className="flex items-center justify-center gap-3 w-full">
								<div className="flex items-center gap-3 max-w-xs">
									<input
										type="text"
										placeholder="Room ID"
										className="w-full sm:w-56 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:border-white/30 text-base"
										value={roomId}
										onChange={handleRoomIdChange}
										disabled={isJoining}
									/>
									<Link to="/game/main">
										<button 
											onClick={() => handleJoinRoom()}
											disabled={isJoining}
											className={`px-6 py-2 rounded-full transition-all duration-300 text-base ${
												isJoining 
													? 'bg-green-500/20 text-green-300 cursor-not-allowed' 
													: 'bg-white/10 text-white hover:bg-white/20'
											}`}
										>
											{isJoining ? 'Connexion...' : 'Join'}
										</button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GamePage;
