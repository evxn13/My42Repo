import React, { useEffect, useState } from 'react';

const LiveCounter: React.FC = (): JSX.Element => {
  // Valeur initiale et constantes
  const INITIAL_COUNT: number = 2605000242;
  const INCREMENT_PER_DAY: number = 50000;
  const INCREMENT_PER_SECOND: number = INCREMENT_PER_DAY / (24 * 60 * 60);

  const [count, setCount] = useState<number>(INITIAL_COUNT);

  useEffect(() => {
    // Mise à jour périodique
    const timer = setInterval(() => {
      setCount(prevCount => prevCount + INCREMENT_PER_SECOND);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return Math.floor(num).toLocaleString('fr-FR');
  };

  return (
    <div className="fixed top-4 right-4 z-30 bg-black/40 p-4 rounded-xl shadow-2xl border border-white/10 hover:scale-105 transition-transform duration-200">
      <div className="text-xs text-gray-400 mb-1 font-semibold tracking-wider">KANYE WEST NET WORTH</div>
      <div className="flex items-baseline">
        <span className="text-green-400 mr-1 font-bold">$</span>
        <div className="text-white font-bold text-2xl tracking-tight">
          {formatNumber(count)}
        </div>
      </div>
      <div className="text-xs text-green-400 mt-1 font-medium">
        <span>▲</span> ${Math.floor(INCREMENT_PER_DAY).toLocaleString('fr-FR')}/day
      </div>
    </div>
  );
};

export default LiveCounter;