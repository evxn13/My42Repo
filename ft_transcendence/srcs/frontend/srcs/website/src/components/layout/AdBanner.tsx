import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const AdBanner: React.FC = (): JSX.Element | null => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [currentAd, setCurrentAd] = useState<string>('');

//tableau de pub -18//

  const ads: string[] = [
    "Achetez des Yeezys maintenant ! -50% avec le code ISIBIO",
    "Nouvelle collection YEEZY disponible !",
    "Écoutez 'Donda' sur Spotify - 30 jours gratuits",
    "Formation rap & business par Ye - Inscrivez-vous",
    "Sunday Service Collection - Édition limitée",
    "WARNING: DO NOT ENTER THIS GAME IF YOU'R UNDER 18"
  ];

  useEffect(() => {
    const randomAd = ads[Math.floor(Math.random() * ads.length)];
    setCurrentAd(randomAd);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomAd = ads[Math.floor(Math.random() * ads.length)];
      setCurrentAd(randomAd);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
      <div className="relative bg-black/40 backdrop-blur-sm px-6 py-4 rounded-xl shadow-2xl border border-white/10 hover:scale-105 transition-all duration-200">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <span className="text-yellow-400 text-xs font-bold px-2 py-1 bg-black/50 rounded-full">AD</span>
            <span className="text-white text-sm font-medium">{currentAd}</span>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="ml-4 text-gray-400 hover:text-white transition-colors"
            type="button"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;