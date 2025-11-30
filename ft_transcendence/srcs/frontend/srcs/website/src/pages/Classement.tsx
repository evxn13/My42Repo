import React from 'react';
import backgroundImage from '../assets/Background-Classement.jpg';
import Sidebar from '../components/layout/Sidebar';

const Classement: React.FC = (): JSX.Element => {
    return (
        <div className="relative overflow-x-hidden bg-black min-h-screen">
            <Sidebar />
            <div 
                className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
                style={{ 
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute top-5 left-20">
                    <h1 className="text-4xl font-bold text-white px-6 py-2 rounded-full bg-gradient-to-r from-black/60 to-transparent">
                        Leaderboard
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default Classement;