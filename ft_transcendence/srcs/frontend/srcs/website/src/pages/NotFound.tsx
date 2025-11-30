import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import backgroundImage from '../assets/Background-Main.jpg';

const NotFound: React.FC = (): JSX.Element => {
    return (
        <div className="relative overflow-x-hidden bg-black min-h-screen">
            <Sidebar />
            <div
                className="w-full bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${backgroundImage})`
                }}
            >
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
                        <h2 className="text-4xl font-bold text-white mb-8">Page not found</h2>
                        <p className="text-xl text-white/80 mb-12">
                            Oups ! This page doesn't exists.
                        </p>
                        <Link to="/">
                            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-lg font-semibold transition-all duration-300 border-2 border-white/50">
                                Back to Home page
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound; 