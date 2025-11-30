/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   GameMainPage.tsx                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tpicoule <tpicoule@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/19 14:35:00 by tpicoule          #+#    #+#             */
/*   Updated: 2025/06/30 17:51:05 by tpicoule         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React, { useState }  from 'react';
import { useEffect }        from 'react';
import { useRef }           from 'react';
import { useContext }       from 'react';
import { useLocation }      from 'react-router-dom';

import { BackendWsContext } from '../context/BackendWsContext.tsx';
import MatchmakingEventWS   from '/lib/transcendence/wsCommunicationsJS/event/MatchmakingEventWS.js';
import { ClientRoomData } from '../components/ClientRoomData';
import UserDetailsWS from '/lib/transcendence/wsCommunicationsJS/user/UserDetailsWS.js';

import Sidebar from '../../website/src/components/layout/Sidebar';
import backgroundImage from '../../website/src/assets/Background-Main.jpg';
import GameTestPage from './GameTestPage';

// Types pour les objets du renderMap
interface RenderMapObject {
    type: string;
    id: string;
    points?: number;
    roomName?: string;
    userDetails?: {
        userId: string;
        token: string;
    };
}

// Type pour le contexte BackendWsContext
type BackendWsContextType = [
    Map<string, RenderMapObject>,
    (message: string) => void,
    () => void,
    React.Dispatch<React.SetStateAction<Map<string, RenderMapObject>>>
];

// Type pour les scores
interface Scores {
    player1: number;
    player2: number;
    player3: number;
    player4: number;
}

// Type pour les usernames des joueurs
interface PlayerUsernames {
    player1: string;
    player2: string;
    player3: string;
    player4: string;
}

// Type pour l'état de location
interface LocationState {
    doMatchmaking?: boolean;
    matchmakingMode?: string;
    isTournament?: boolean;
}

function extractScoresFromRenderMap(renderMap: Map<string, RenderMapObject>): Scores {
    let scores: Scores = { player1: 0, player2: 0, player3: 0, player4: 0 };
    let playerIndex = 1;
    for (const [, object] of renderMap) {
        if (object.type === "clientRoomData") {
            scores[`player${playerIndex}` as keyof Scores] = object.points ?? 0;
            playerIndex++;
        }
    }
    return scores;
}

const GameMainPage: React.FC = () => {
    // * functions
    let [ renderMap, sendMessageToGameBackendWs, clearRenderMap, setRenderMap ]: BackendWsContextType = useContext(BackendWsContext);

    let location = useLocation();
    let { doMatchmaking = false, matchmakingMode = MatchmakingEventWS.noMode, isTournament = false }: LocationState = location.state || {};

    let pageLeft = function(): void
    {
        if (doMatchmaking)
            stopMatchmaking();
    }

    let launchMatchmaking = function(): void
    {
        let event       = new MatchmakingEventWS();
        event.mode      = matchmakingMode;
        event.status    = MatchmakingEventWS.launch;
        sendMessageToGameBackendWs(event.createJSON());
    }

    let stopMatchmaking = function(): void
    {
        let event       = new MatchmakingEventWS();
        event.status    = MatchmakingEventWS.stop;
        sendMessageToGameBackendWs(event.createJSON());
    }

    const [scores, setScores] = useState<Scores>({
        player1: 0,
        player2: 0,
        player3: 0,
        player4: 0
    });

    const [usernames, setUsernames] = useState<PlayerUsernames>({
        player1: "PLAYER 1",
        player2: "PLAYER 2", 
        player3: "PLAYER 3",
        player4: "PLAYER 4"
    });

    const [roomName, setRoomName] = useState<string>("NewRoom");

    const extractedScores = extractScoresFromRenderMap(renderMap);
    const usernameCache = useRef<Map<string, string>>(new Map());

    // Fonction pour récupérer le username depuis l'userId
    const getUsernameFromId = async (userId: string): Promise<string> => {
        const cachedUsername = usernameCache.current.get(userId);
        if (cachedUsername) return cachedUsername;

        if (userId === UserDetailsWS.AiId) {
            usernameCache.current.set(userId, "🤖 AI");
            return "🤖 AI";
        }
        if (userId === UserDetailsWS.AnonymousId) {
            usernameCache.current.set(userId, " Anonymous");
            return " Anonymous";
        }

        try {
            const response = await fetch(`https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api/meID?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok)
            {
                const data = await response.json();
                const username = data?.user?.username ?? "Unknown Player";

                usernameCache.current.set(userId, username); // cache username
                return username;
            }

            return "Unknown Player";
        } catch (error) {
            console.error("Erreur lors de la récupération du username:", error);
        }
    };

    // Mise à jour des scores, usernames et du nom de la room en temps réel
    useEffect(() => {
        const updateGameInfo = async (): Promise<void> => {
            const newScores: Scores = { ...scores };
            const newUsernames: PlayerUsernames = { ...usernames };
            let playerIndex = 1;

            for (const [id, object] of renderMap) {
                if (object.type === "clientRoomData") {
                    newScores[`player${playerIndex}` as keyof Scores] = object.points ?? 0;
                
                    // Récupérer le username si on a les userDetails
                    if (object.userDetails?.userId) {
                        let username = usernameCache.current.get(object.userDetails.userId); // get from cache

                        if (!username) // username not cached, retrieving from API
                            username = await getUsernameFromId(object.userDetails.userId);

                        newUsernames[`player${playerIndex}` as keyof PlayerUsernames] = username;
                    }
                    
                    playerIndex++;
                } else if (object.type === "roomCreationEvent") {
                    if (object.roomName) {
                        setRoomName(object.roomName);
                    }
                }
            }
            setScores(newScores);
            setUsernames(newUsernames);
        };

        updateGameInfo();
    }, [JSON.stringify(extractedScores), renderMap.size]);

    
    const getPlayerCount = () => {
        let count = 0;
        for (const [, object] of renderMap) {
            if (object.type === "clientRoomData") {
                count++;
            }
        }
        return count;
    };

    const playerCount = getPlayerCount()

    // * MAIN
    useEffect(() => {
        if (doMatchmaking)
            launchMatchmaking();

        return () =>
        {
            pageLeft();
        }; 
    }, []);

    return (
        <div className="relative overflow-x-hidden bg-black min-h-screen">
            <Sidebar />
            <div
                className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundAttachment: 'fixed',
                }}
            >
                <style>
                    {`
                    :root {
                        --game-scale: 1;
                    }
                    
                    @media (max-width: 1400px) {
                        :root {
                            --game-scale: 0.8;
                        }
                        .game-ui {
                            display: none;
                        }
                        .hide-on-mobile {
                            display: none;
                        }
                    }
                    
                    @media (max-width: 1024px) {
                        :root {
                            --game-scale: 0.6;
                        }
                    }
                    
                    @media (max-width: 768px) {
                        :root {
                            --game-scale: 0.4;
                        }
                    }                    
                    @media (max-width: 460px) {
                        :root {
                            --game-scale: 0.2;
                        }
                    }

                    `}
                </style>
                <div className="absolute top-5 left-20 hide-on-mobile">
                    <h1 className="text-4xl font-bold text-white px-6 py-2 rounded-full bg-gradient-to-r from-black/60 to-transparent">
                        G@ming
                    </h1>
                </div>

                {/* Container principal */}
                <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                    {/* Zone de jeu */}
                    <div
                        className="bg-white/10 backdrop-blur-sm border-4 border-white/50 rounded-2xl shadow-lg relative"
                        style={{
                            width: '1500px',
                            height: '800px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Éléments décoratifs en haut */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 game-ui">
                            <div className="bg-black/80 backdrop-blur-sm outline outline-white/90 rounded-lg animate-pulse shadow-lg p-3 px-6 relative">
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <h2 className="text-white text-2xl font-bold font-mono tracking-wider drop-shadow-[0_0_5px_white] select-all">
                                        {roomName}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Éléments Player 1 */}
                        <div className="absolute left-4 top-4 game-ui">
                            <div className="bg-black/80 backdrop-blur-sm outline outline-white/90 rounded-lg animate-pulse shadow-lg p-3 relative">
                                <div className="text-white text-lg font-bold font-mono tracking-wider drop-shadow-[0_0_5px_white] relative z-10">
                                    {usernames.player1}
                                </div>
                                <div className="text-white/70 text-sm mt-1 relative z-10">
                                    SCORE: {scores.player1}
                                </div>
                            </div>
                        </div>

                        {/* Éléments Player 2 */}
                        <div className="absolute right-4 top-4 game-ui">
                            <div className="bg-black/80 backdrop-blur-sm outline outline-white/90 rounded-lg animate-pulse shadow-lg p-3 relative">
                                <div className="text-white text-lg font-bold font-mono tracking-wider drop-shadow-[0_0_5px_white] relative z-10">
                                    {usernames.player2}
                                </div>
                                <div className="text-white/70 text-sm mt-1 relative z-10">
                                    SCORE: {scores.player2}
                                </div>
                            </div>
                        </div>

                        {/* Éléments Player 3 et 4 - affichés uniquement si ce n'est pas un tournoi ET qu'il y a plus de 2 joueurs */}
                        {!isTournament && playerCount > 2 && (
                            <>
                                {/* Éléments décoratifs pour Player 3 */}
                                <div className="absolute left-4 bottom-4 game-ui">
                                    <div className="bg-black/80 backdrop-blur-sm outline outline-white/90 rounded-lg animate-pulse shadow-lg p-3 relative">
                                        <div className="text-white text-lg font-bold font-mono tracking-wider drop-shadow-[0_0_5px_white] relative z-10">
                                            {usernames.player3}
                                        </div>
                                        <div className="text-white/70 text-sm mt-1 relative z-10">
                                            SCORE: {scores.player3}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Éléments décoratifs pour Player 4 */}
                        {!isTournament && playerCount > 3 && (
                            <>
                                <div className="absolute right-4 bottom-4 game-ui">
                                    <div className="bg-black/80 backdrop-blur-sm outline outline-white/90 rounded-lg animate-pulse shadow-lg p-3 relative">
                                        <div className="text-white text-lg font-bold font-mono tracking-wider drop-shadow-[0_0_5px_white] relative z-10">
                                            {usernames.player4}
                                        </div>
                                        <div className="text-white/70 text-sm mt-1 relative z-10">
                                            SCORE: {scores.player4}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Éléments décoratifs en bas */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 game-ui">
                            <div className="bg-black/80 backdrop-blur-sm outline outline-white/90 rounded-lg animate-pulse shadow-lg p-3 relative">
                                <div className="text-white text-sm font-bold font-mono tracking-wider drop-shadow-[0_0_5px_white] relative z-10">
                                    USE <span className="text-xl">↑↓</span> TO MOVE
                                </div>
                            </div>
                        </div>

                        {/* Conteneur du terrain de jeu */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative" style={{
                                width: '1400px',
                                height: '800px',
                                transform: 'scale(var(--game-scale, 1))',
                                transformOrigin: 'center'
                            }}>
                                <GameTestPage />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameMainPage;