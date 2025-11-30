import React, { useEffect, useState } from 'react';
import backgroundImage from '../../website/src/assets/Background-Historique.jpg';
import Sidebar from '../../website/src/components/layout/Sidebar';
import axiosClient from '../utils/axiosClient';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../website/src/hooks/useAuth';

interface ImportMetaEnv {
    VITE_HOST_TRANSCENDENCE: string;
    VITE_PORT_FASTIFY: string;
}

interface ImportMeta {
    env: ImportMetaEnv;
}

interface User {
    id: number;
    username: string;
    numOfGames: number;
    wins: number;
    losses: number;
    total_score: number;
}

interface GameHistory {
    match_date: string;
    statsJSONED: {
        clientDataArr: Array<{
            userDetails: {
                userId: number;
            };
            points: number;
            isVictory: boolean;
        }>;
    };
}

function AccountHistorique() {
    const [error, setError] = useState<string | null>(null);
    const {isAuthenticated } = useAuth();
    const [profilUser, setProfileUser] = useState<User | null>(null);
    const { username } = useParams<{ username: string }>();
    const [gameHistory, setGameHistory] = useState<GameHistory[] | null>([]);
    
    useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            if (!isAuthenticated) return;
            
            try {
                const endpoint: string = username 
                ? `/you/${username}`
                : `/me`;
                const res = await axiosClient.get(endpoint);
                if (res.data.success) {
                    setProfileUser(res.data.user);
                    setError(null);
                } else {
                    setError(res.data.error || "Error while profil recup");
                }
            } catch (err: any) {
                console.log("Error while profil recup ACCOUNT HISTORIQUE");
            }
        };
        fetchUser();
    }, [username]);
    
    //////////////////TESTINGGGGG
    useEffect(() => {
        const fetchHistory = async (): Promise<void> => {
            // Only proceed if profileUser exists and has an ID
            if (!profilUser?.id) {
                setGameHistory(null); // Ensure history is cleared if profileUser becomes null
                return;
            }
            
            try {
                // Ensure the endpoint matches your backend route, e.g., /getHistory/123
                const endpoint: string = `/getHistory/${profilUser.id}`;
                const res = await axiosClient.get(endpoint);

                if (res.data.success) {
                    setGameHistory(res.data.games);
                } else {
                    // Specific error for history fetching
                    setError(res.data.error || "Error while history recup.");
                }
            } catch (err: any) {
                if (err.response?.status === 404)
                    console.log("Play some games skinny boy");
                else
                    console.log("Error while history recup.");
            }
        };
        fetchHistory();
    }, [profilUser]);

    useEffect(() => {
        if (gameHistory !== null && gameHistory.length > 0)
        {
            console.log("gameHistory updated:", gameHistory);
            console.log("total score:", profilUser?.total_score);
        }

    }, [gameHistory]);

    /////////////////////////TESTINGGGGG
    // Calcul du ratio Win/Loss
    const winRatio: string = profilUser && profilUser.numOfGames > 0 ? ((profilUser.wins / profilUser.numOfGames) * 100).toFixed(1) : '0';

    if (error) return <div className="text-black text-center mt-8">{error}</div>;
    if (!profilUser) return <div className="text-black text-center mt-8">Loading...</div>;

    return (
        <div className="min-h-screen relative overflow-x-hidden">
            <Sidebar />
            <main className="min-h-screen w-full absolute top-0 left-0">
                <div 
                    className="fixed inset-0 -z-10"
                    style={{ 
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
                <div className="absolute top-5 left-20 z-10 hidden sm:block">
                    <h1 className="text-4xl font-bold text-white px-6 py-2 rounded-full bg-gradient-to-r from-black/60 to-transparent">
                        {username ? `History : ${username}` : 'History'}
                    </h1>
                </div>
            </main>
            
            {/* Container principal avec flex */}
            <div className="w-full px-4 pt-24 flex flex-col">
                {/* Container pour les cartes */}
                <div className="w-full flex mobile:flex-col gap-8 ml-[320px] mobile:ml-0 mobile:items-center">
                    {/* Carte Statistiques */}
                    <div className="w-[360px] mobile:w-full mobile:max-w-[360px] h-[600px] mobile:h-auto bg-black/20 backdrop-blur-sm rounded-2xl p-8 mobile:p-6 overflow-y-auto">
                        <div className="h-full">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">Statistics</h2>
                            <div className="space-y-4 text-white/80">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span>Games played</span>
                                    <span className="text-white">{profilUser.numOfGames}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span>Victories</span>
                                    <span className="text-white">{profilUser.wins}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span>Defeats</span>
                                    <span className="text-white">{profilUser.losses}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span>Win rate Win/games</span>
                                    <span className="text-white">{winRatio}%</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span>Total Goals</span>
                                    <span className="text-white">{profilUser.total_score}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Carte Historique Détaillé */}
                    <div className="w-[360px] mobile:w-full mobile:max-w-[360px] h-[600px] mobile:h-auto bg-black/20 backdrop-blur-sm rounded-2xl p-8 mobile:p-6 overflow-y-auto">
                        <div className="h-full">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">Detailed History</h2>
                            <div className="space-y-2 text-white/80">
                                {gameHistory && gameHistory.length > 0 ? (
                                    gameHistory.slice(0, 10).map((game, index) => {
                                        const stats = game.statsJSONED;
                                        const currentPlayer = stats.clientDataArr.find(player => 
                                            player.userDetails.userId === profilUser.id
                                        );
                                        const opponent = stats.clientDataArr.find(player => 
                                            player.userDetails.userId !== profilUser.id
                                        );

                                        return (
                                            <div key={index} className="text-white">
                                                {currentPlayer && opponent && (
                                                    <>
                                                        {new Date(game.match_date).toLocaleString('FR-fr')} - {currentPlayer.points} - {opponent.points}
                                                        <span className={`ml-2 font-bold ${currentPlayer.isVictory ? 'text-white' : 'text-white'}`}>
                                                            {currentPlayer.isVictory ? '(V)' : '(D)'}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center text-white/60 py-8">
                                        <p>No Game Played</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountHistorique;
