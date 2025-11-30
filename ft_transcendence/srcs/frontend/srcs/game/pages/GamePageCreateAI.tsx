import Sidebar	from '../../website/src/components/layout/Sidebar';
import backgroundImage from '../../website/src/assets/Background-createAI.jpg';
import { FaUserFriends, FaRobot, FaTrophy, FaUsers, FaClock, FaTachometerAlt, FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Page_name from '../../website/src/components/layout/Page_name';
import GameTestPage from '../pages/GameTestPage';

import RoomObjectDataWS		from '/lib/transcendence/wsCommunicationsJS/gameRoom/RoomObjectDataWS.js';
import RoomCreationEventWS	from '/lib/transcendence/wsCommunicationsJS/event/RoomCreationEventWS.js';
import JoinRoomEventWS		from '/lib/transcendence/wsCommunicationsJS/event/JoinRoomEventWS.js';
import BallWS				from '/lib/transcendence/wsCommunicationsJS/ball/BallWS.js';
import PaddleWS				from '/lib/transcendence/wsCommunicationsJS/paddle/PaddleWS.js';
import BoardWS				from '/lib/transcendence/wsCommunicationsJS/board/BoardWS.js';
import PointWS				from '/lib/transcendence/wsCommunicationsJS/PointWS.js';
import LaunchGameEventWS	from '/lib/transcendence/wsCommunicationsJS/event/LaunchGameEventWS.js';

import { BackendWsContext }	from '../context/BackendWsContext.tsx';
import { useState, useEffect }			from 'react';
import { useContext }		from 'react';
import React				from 'react';
import {v4 as uuidv4}		from 'uuid';


let defaultRoomName				= "NewRoom";
let roomName					= defaultRoomName;
let defaultRoomCreationEvent	= RoomCreationEventWS.createRoomRectangle(roomName, 2);
let roomCreationEvent			= defaultRoomCreationEvent;

const GamePageCreateAI: React.FC = () =>
{
	let roomUniqueId		= uuidv4();

	let		[ renderMap, sendMessageToGameBackendWs, clearRenderMap, setRenderMap ]	= useContext(BackendWsContext);
	const	[maxPoints, setMaxPoints]				= useState<number>(RoomCreationEventWS.pointForClientWinDefault);
	const	[roomNameInput, setRoomNameInput]		= useState<string>(roomName);
	const	[roomNameError, setRoomNameError]		= useState<string | null>(null);
	const	[isRoomNameValid, setIsRoomNameValid]	= useState<boolean>(true);
	const	[countdown, setCountdown]				= useState<number>(RoomCreationEventWS.countdownBeforeGameStartsDefault);
	const	[paddleSpeed, setPaddleSpeed]			= useState<number>(700);
	const	[ballSize, setBallSize]					= useState<number>(BallWS.minSize);
	const	[ballSpeed, setBallSpeed]				= useState<number>(BallWS.minSpeed);
	const	[ballAcceleration, setBallAcceleration]	= useState<number>(1.10);

	let firstRender = function(): void
	{
		updatePreview();
	}

	let pageLeft = function(): void
	{
		roomCreationEvent			= defaultRoomCreationEvent;
		roomName					= defaultRoomName;
		roomCreationEvent.roomName	= roomName;
	}

	useEffect(() => {
		firstRender();

		return () =>
		{
			pageLeft();
		}; 
	}, []);

	// Validation initiale du nom de room
	useEffect(() => {
		validateRoomName(roomName);
	}, []);

	// Mise à jour des points de victoire
	useEffect(() => {
		roomCreationEvent.setPointForClientWin(maxPoints);
	}, [maxPoints]);

	useEffect(() => {
		const handleResize = () => {
			// setShowMap(window.innerWidth > 1360);
		};

		handleResize(); // Check initial size
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	// Mise à jour de la vitesse de la balle
	useEffect(() => {
		for (const [obj, data] of roomCreationEvent.objectMap) {
			if (BallWS.isGoodTypeJSON(obj.type)) {
				obj.setSpeed(ballSpeed);
				data.update = true;
			}
		}
		updatePreview();
	}, [ballSpeed]);

	// Mise à jour de la taille de la balle
	useEffect(() => {
		for (const [obj, data] of roomCreationEvent.objectMap) {
			if (BallWS.isGoodTypeJSON(obj.type)) {
				obj.setSize(ballSize);
				data.update = true;
			}
		}
		updatePreview();
	}, [ballSize]);

	// Mise à jour de l'accélération de la balle
	useEffect(() => {
		for (const [obj, data] of roomCreationEvent.objectMap) {
			if (BallWS.isGoodTypeJSON(obj.type)) {
				obj.setAccelerationOnHit(ballAcceleration);
				data.update = true;
			}
		}
		updatePreview();
	}, [ballAcceleration]);

	// Mise à jour de la vitesse des paddles
	useEffect(() => {
		for (const [obj, data] of roomCreationEvent.objectMap) {
			if (PaddleWS.isGoodTypeJSON(obj.type)) {
				obj.setSpeed(paddleSpeed);
				data.update = true;
			}
		}
		updatePreview();
	}, [paddleSpeed]);

	// Mise à jour du countdown
	useEffect(() => {
		roomCreationEvent.setCountdownBeforeGameStarts(countdown);
	}, [countdown]);

	// Mise à jour des points max
	useEffect(() => {
		roomCreationEvent.setPointForClientWin(maxPoints);
	}, [maxPoints]);

	let sendMapToBackend = function(roomCreationEvent_ = roomCreationEvent): void
	{
		clearRenderMap();
		roomCreationEvent_.roomName					= roomCreationEvent_.roomName + " #" + roomUniqueId.slice(0, 4);
		roomCreationEvent_.nbAiToJoin				= 1;
		roomCreationEvent_.isMatchmakingPossible	= false;

		sendMessageToGameBackendWs(roomCreationEvent.createJSON());
		sendMessageToGameBackendWs((new JoinRoomEventWS(roomCreationEvent_.roomName)).createJSON());

		// * NOT DEFINITIVE / TO REMOVE
		// sendMessageToGameBackendWs((new LaunchGameEventWS(roomCreationEvent_.roomName)).createJSON());
	}
////////////////////////////////////////////////////////////
	//ligne 162 la retirer object data ? demander a Ivan//
////////////////////////////////////////////////////////////

	let updatePreview = function(roomCreationEvent_ = roomCreationEvent): void
	{
		let	previewRenderMap	= new Map();

		clearRenderMap();
		for (let [object, objectData] of roomCreationEvent_.objectMap)
			previewRenderMap.set(object.id, object);
		setRenderMap(previewRenderMap);
	}


	// Fonction de validation du nom de room
	const validateRoomName = (name: string) => {
		if (name.length < RoomCreationEventWS.roomNameMinLength) {
			setRoomNameError(`Room name need to be at least ${RoomCreationEventWS.roomNameMinLength} characters`);
			setIsRoomNameValid(false);
			return false;
		}
		if (name.length > RoomCreationEventWS.roomNameMaxLength) {
			setRoomNameError(`Room name can't be more than ${RoomCreationEventWS.roomNameMaxLength} characters`);
			setIsRoomNameValid(false);
			return false;
		}
		setRoomNameError(null);
		setIsRoomNameValid(true);
		return true;
	};

	// Fonctions de mise à jour centralisées
	const updateBallSpeed = (newSpeed: number) => {
		setBallSpeed(newSpeed);
		for (const [obj, data] of roomCreationEvent.objectMap) {
			if (BallWS.isGoodTypeJSON(obj.type)) {
				obj.setSpeed(newSpeed);
				data.update = true;
			}
		}
	};

	const updateBallSize = (newSize: number) => {
		setBallSize(newSize);
		for (const [obj, data] of roomCreationEvent.objectMap) {
			if (BallWS.isGoodTypeJSON(obj.type)) {
				obj.setSize(newSize);
				data.update = true;
			}
		}
	};

	const updateBallAcceleration = (newAcceleration: number) => {
		setBallAcceleration(newAcceleration);
		for (const [obj, data] of roomCreationEvent.objectMap) {
			if (BallWS.isGoodTypeJSON(obj.type)) {
				obj.setAccelerationOnHit(newAcceleration);
				data.update = true;
			}
		}
	};

	const updatePaddleSpeed = (newSpeed: number) => {
		setPaddleSpeed(newSpeed);
		for (const [obj, data] of roomCreationEvent.objectMap) {
			if (PaddleWS.isGoodTypeJSON(obj.type)) {
				obj.setSpeed(newSpeed);
				data.update = true;
			}
		}
	};

	// Mise à jour du countdown
	const updateCountdown = (newCountdown: number) => {
		setCountdown(newCountdown);
		roomCreationEvent.setCountdownBeforeGameStarts(newCountdown);
	};

	// Mise à jour des points max
	const updateMaxPoints = (newPoints: number) => {
		setMaxPoints(newPoints);
		roomCreationEvent.setPointForClientWin(newPoints);
	};

	return (
		<div className="relative overflow-x-hidden bg-black min-h-screen">
			<Sidebar />
			<div
				className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: `url(${backgroundImage})`,
					// backgroundAttachment: 'fixed',
				}}
			>
				<style>
					{`
					@media (max-width: 1360px) {
						.hide-on-small {
							display: none;
						}
					}
					@media (max-width: 1100px) {
						.hide-on-mobile {
							display: none;
						}
					}
					`}
				</style>
				<div className="absolute top-5 left-20 hide-on-mobile">
					<h1 className="text-4xl font-bold text-white px-6 py-2 rounded-full bg-gradient-to-r from-black/60 to-transparent">
						Create_Game_AI
					</h1>
				</div>
				{/* Container principal */}
				<div className="min-h-screen flex items-center justify-center">
					<div className="flex flex-row mobile:flex-col items-center gap-8 p-4">
						{/* Section des icônes - maintenant vide */}
						{/* <div className="bg-black/20 backdrop-blur-sm border-4 border-white/30 rounded-2xl shadow-lg p-8 hide-on-small">
							{/* <div className="flex flex-col mobile:flex-row gap-8 justify-center">
								{/* Contenu supprimé */}
							{/* </div> */ }
					

						{/* Container du jeu */}
						<div className="hide-on-small">
							<div
								className="bg-black/20 backdrop-blur-sm border-1 border-white/30 rounded-2xl shadow-lg flex items-center justify-center"
								style={{
									width: '800px',
									height: '600px',
								}}>
								<GameTestPage leaveRoom={false}/>
							</div>
						</div>

						{/* Panneau de configuration */}
						<div className="bg-black/20 backdrop-blur-sm scale-[97%] border-1 border-white/30 rounded-2xl mt-10 sm:mt-0 sm:h-[600px] sm:w-[365px] h-fit shadow-lg p-8 w-96 overflow-auto"
						>
							<h2 className="text-2xl font-bold text-white mb-8 text-center">Configuration</h2>

							{/* Nom de la Room */}
							<div className="mb-6">
								<h3 className="text-white text-base mb-2 font-bold">Room name</h3>
								<input 
									type="text" 
									value={roomNameInput}
									onChange={(e) => {
										const newName = e.target.value;
										setRoomNameInput(newName);
										validateRoomName(newName);
										
										// Gestion de l'erreur avec try-catch
										try {
											roomCreationEvent.setRoomName(newName);
										} catch (error){}
									}}
									className={`w-full px-4 py-2 rounded-lg bg-white/10 text-white border ${roomNameError ? 'border-white' : 'border-white/30'} focus:outline-none focus:border-white/50`}
									placeholder="Enter room name"
								/>
								{roomNameError && (
									<p className="absolute text-sm text-white mt-1">{roomNameError}</p>
								)}
							</div>

							{/* Option Nombre de Points Max */}
							<div className="mb-6">
								<h3 className="text-white text-base mb-2 font-bold">Max points</h3>
								<div className="flex items-center justify-between gap-6">
									<button 
										onClick={() => updateMaxPoints(Math.max(RoomCreationEventWS.pointForClientWinMin, maxPoints - 1))}
										className="glass-button"
									>
										-
									</button>
									<span className="text-white text-2xl font-bold px-6">{maxPoints}</span>
									<button 
										onClick={() => updateMaxPoints(Math.min(RoomCreationEventWS.pointForClientWinMax, maxPoints + 1))}
										className="glass-button pb-0"
									>
										+
									</button>
								</div>
								{/* <div className="text-white/60 text-sm mt-2 text-center">
									Min: {RoomCreationEventWS.pointForClientWinMin} | Max: {RoomCreationEventWS.pointForClientWinMax}
								</div> */}
							</div>

							{/* Menu Countdown */}
							<div className="mb-4">
								<details className="group">
									<summary className="select-none flex items-center justify-between py-2 rounded-lg text-white cursor-pointer transition-all duration-300">
										<span className="text-base font-semibold">Countdown</span>
										<svg className="w-4 h-4 transform group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
										</svg>
									</summary>
									<div className="space-y-2 pt-2">
										<div>
											<h4 className="text-white text-center text-sm mb-1">Time before beginning (ms)</h4>
											<div className="flex items-center justify-between gap-6">
												<button 
													onClick={() => {
														const newCountdown = Math.max(RoomCreationEventWS.countdownBeforeGameStartsMin, countdown - 500);
														updateCountdown(newCountdown);
													}}
													className="glass-button"
												>
													-
												</button>
												<span className="text-white text-2xl font-bold px-8">{countdown}</span>
												<button 
													onClick={() => {
														const newCountdown = Math.min(RoomCreationEventWS.countdownBeforeGameStartsMax, countdown + 500);
														updateCountdown(newCountdown);
													}}
													className="glass-button pb-0"
												>
													+
												</button>
											</div>
											{/* <div className="text-white/60 text-sm mt-2 text-center">
												Min: {RoomCreationEventWS.countdownBeforeGameStartsMin}ms | Max: {RoomCreationEventWS.countdownBeforeGameStartsMax}ms
											</div> */}
										</div>
									</div>
								</details>
							</div>

							{/* Menu Balle */}
							<div className="mb-4">
								<details className="group">
									<summary className="select-none flex items-center justify-between py-2 rounded-lg text-white cursor-pointer transition-all duration-300">
										<span className="text-base text-center font-semibold">Ball</span>
										<svg className="w-4 h-4 transform group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
										</svg>
									</summary>
									<div className="pt-2 space-y-2">
										<div>
											<h4 className="text-white text-center text-sm mt-1">Speed</h4>
											<div className="flex items-center justify-between gap-6">
												<button 
													onClick={() => {
														const newSpeed = Math.max(BallWS.minSpeed, ballSpeed - 100);
														updateBallSpeed(newSpeed);
													}}
													className="glass-button"
												>
													-
												</button>
												<span className="text-white text-2xl font-bold px-8">{ballSpeed}</span>
												<button 
													onClick={() => {
														const newSpeed = Math.min(BallWS.maxSpeed, ballSpeed + 100);
														updateBallSpeed(newSpeed);
													}}
													className="glass-button pb-0"
												>
													+
												</button>
											</div>
										</div>
										<div>
											<h4 className="text-white text-center text-sm mt-1">Size</h4>
											<div className="flex items-center justify-between gap-6">
												<button 
													onClick={() => {
														const newSize = Math.max(BallWS.minSize, ballSize - 5);
														updateBallSize(newSize);
													}}
													className="glass-button"
												>
													-
												</button>
												<span className="text-white text-2xl font-bold px-8">{ballSize}</span>
												<button 
													onClick={() => {
														const newSize = Math.min(BallWS.maxSize, ballSize + 5);
														updateBallSize(newSize);
													}}
													className="glass-button p-0"
												>
													+
												</button>
											</div>
										</div>
										<div>
											<h4 className="text-white text-center text-sm mt-1">Acceleration</h4>
											<div className="flex items-center justify-between gap-6">
												<button 
													onClick={() => {
														const newAcceleration = Math.max(BallWS.minAccelerationOnHit, ballAcceleration - 0.05);
														updateBallAcceleration(newAcceleration);
													}}
													className="glass-button"
												>
													-
												</button>
												<span className="text-white text-2xl font-bold px-8">{ballAcceleration.toFixed(2)}</span>
												<button 
													onClick={() => {
														const newAcceleration = Math.min(BallWS.maxAccelerationOnHit, ballAcceleration + 0.05);
														updateBallAcceleration(newAcceleration);
													}}
													className="glass-button p-0"
												>
													+
												</button>
											</div>
										</div>
									</div>
								</details>
							</div>

							{/* Menu Paddle */}
							<div className="mb-4">
								<details className="group">
									<summary className="select-none flex items-center justify-between py-2 rounded-lg text-white cursor-pointer transition-all duration-300">
										<span className="text-base font-semibold">Paddle</span>
										<svg className="w-4 h-4 transform group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
										</svg>
									</summary>
									<div className="pt-2 space-y-2">
										<div>
											<h4 className="text-white text-center text-sm mt-1">Speed</h4>
											<div className="flex items-center justify-between gap-6">
												<button 
													onClick={() => {
														updatePreview();
														const newSpeed = Math.max(PaddleWS.minSpeed, paddleSpeed - 100);
														updatePaddleSpeed(newSpeed);
													}}
													className="glass-button"
												>
													-
												</button>
												<span className="text-white text-2xl font-bold px-8">{paddleSpeed}</span>
												<button 
													onClick={() => {
														updatePreview();
														const newSpeed = Math.min(PaddleWS.maxSpeed, paddleSpeed + 100);
														updatePaddleSpeed(newSpeed);
													}}
													className="glass-button p-0"
												>
													+
												</button>
											</div>
										</div>
									</div>
								</details>
							</div>

							{/* Boutons */}
							<div className="flex gap-4 mt-8">
								<Link to={isRoomNameValid ? "/game/main" : "#"} className="flex-1">
									<button
										onClick={(e) => {
											if (!isRoomNameValid) {
												e.preventDefault();
												setRoomNameError("Le nom de la room n'est pas valide");
											} else {
												sendMapToBackend();
											}
										}}
										className={`flex-1 px-4 py-2 ${isRoomNameValid ? 'bg-white/10 hover:bg-white/20' : 'cursor-not-allowed'} text-white h-16 rounded-xl transition-all duration-300 text-base font-semibold`}
									>
										Classic Burger
									</button>
								</Link>
								<Link to="/game" className="flex-1 h-full">
									<button
										className="w-full px-4 py-2 h-16 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 text-base font-semibold"
									>
										Cancel
									</button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GamePageCreateAI;