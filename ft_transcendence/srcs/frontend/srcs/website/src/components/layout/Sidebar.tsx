import React, { useState } from 'react';
import { FaHome, FaUser, FaGamepad, FaTrophy, FaCog } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {/* //Borgor button qui se mouvoi// */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-40 p-3 rounded-full hover:bg-black/80 transition-all duration-200 hover:scale-110"
        type="button"
      >
        <div className={`w-6 h-0.5 bg-white transition-transform duration-300 ${
          isOpen ? 'rotate-45 translate-y-1.5' : ''
        }`}></div>
        <div className={`w-6 h-0.5 bg-white my-1 transition-opacity duration-300 ${
          isOpen ? 'opacity-0' : ''
        }`}></div>
        <div className={`w-6 h-0.5 bg-white transition-transform duration-300 ${
          isOpen ? '-rotate-45 -translate-y-1.5' : ''
        }`}></div>
      </button>

      {/* //gros Borgor Button// */}
      <div className={`fixed top-4 h-[calc(100vh-2rem)] w-64 backdrop-blur-sm bg-black/50 text-white transform transition-transform duration-300 ease-in-out z-30 rounded-2xl shadow-2xl ${
        isOpen ? 'translate-x-0 left-4' : '-translate-x-full'
      }`}>
        <div className="p-4 mt-16">
          <nav className="space-y-4">
            <Link to="/" className="flex items-center py-2.5 px-4 rounded-xl hover:bg-black/50 transition duration-200">
              <FaHome className="mr-3 transition-transform duration-200 hover:scale-125" /> Home
            </Link>
            <Link to="/profil" className="flex items-center py-2.5 px-4 rounded-xl hover:bg-black/50 transition duration-200">
              <FaUser className="mr-3 transition-transform duration-200 hover:scale-125" /> Profil
            </Link>
            <Link to="/game" className="flex items-center py-2.5 px-4 rounded-xl hover:bg-black/50 transition duration-200">
              <FaGamepad className="mr-3 transition-transform duration-200 hover:scale-125" /> Play
            </Link>
            <Link to="/chat" className="flex items-center py-2.5 px-4 rounded-xl hover:bg-black/50 transition duration-200">
              <FaMessage className="mr-3 transition-transform duration-200 hover:scale-125" /> Chat
            </Link>
            <Link to="/leaderboard" className="flex items-center py-2.5 px-4 rounded-xl hover:bg-black/50 transition duration-200">
              <FaTrophy className="mr-3 transition-transform duration-200 hover:scale-125" /> Leaderboard
            </Link>
            <Link to="/account/gestion" className="flex items-center py-2.5 px-4 rounded-xl hover:bg-black/50 transition duration-200">
              <FaCog className="mr-3 transition-transform duration-200 hover:scale-125" /> Account
            </Link>
          </nav>
        </div>
      </div>

      {/*//petit borgor si clik ailleur//*/}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 transition-all duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
