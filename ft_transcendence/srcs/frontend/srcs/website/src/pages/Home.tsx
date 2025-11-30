import React from 'react';
import backgroundImage from '../assets/Background-Home.jpg';
import Sidebar from '../components/layout/Sidebar';
import LiveCounter from '../components/layout/LiveCounter';
import AdBanner from '../components/layout/AdBanner';
import Login_Button from '../components/layout/Login_Button';

const Home: React.FC = (): JSX.Element => {
    return (
        <div className="relative overflow-x-hidden bg-black min-h-screen">
            <Sidebar />
            <div className="hidden sm:block">
                <LiveCounter />
                <AdBanner />
            </div>
            <div 
                className="min-h-screen w-full bg-center bg-cover bg-no-repeat flex flex-col items-center justify-center"
                style={{ 
                    backgroundImage: `url(${backgroundImage})`
                }}
            >
                <h1 className="hidden sm:block text-4xl md:text-6xl lg:text-8xl font-thin blur-[1px] text-white mb-4 tracking-[.25em] drop-shadow-[0_0_10px_rgba(255, 186, 85, 0.8)] backdrop-blur-sm select-none">
                    P**G IN PARIS
                </h1>
                <Login_Button />
            </div>
        </div>
    );
};

export default Home;
