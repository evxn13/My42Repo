import React, { useState } from 'react';

const YeQuoteGenerator: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<string>('I am Ye, and I am the greatest artist of all time.');

  const kanyeQuotes: string[] = [
    "I am the greatest artist of all time.",
    "My greatest pain in life is that I will never be able to see myself perform live.",
    "I feel like I'm too busy writing history to read it.",
    "Everything I'm not made me everything I am.",
    "I'm a creative genius and there's no other way to word it.",
    "I still think I am the greatest.",
    "For me, money is not my definition of success. Inspiring people is a definition of success.",
    "I'm going to be the Tupac of product.",
    "I'm the closest that hip-hop is getting to God.",
    "I'm a creative genius, and there's no other way to word it."
  ];

  const generateNewQuote = (): void => {
    const randomIndex = Math.floor(Math.random() * kanyeQuotes.length);
    setCurrentQuote(kanyeQuotes[randomIndex]);
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 w-[700px]">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-white mb-6">YE WISDOM GENERATOR</h2>
        
        {/* Phrase aleatoire*/}
        <div className="text-center mb-6">
          <p className="text-white text-xl italic">
            {currentQuote}
          </p>
        </div>

        {/* Bouton nouvelle phrase */}
        <button 
          onClick={generateNewQuote}
          className="px-8 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
          type="button"
        >
          <span>
            Drop Another Ye Quote 🎤
          </span>
        </button>
      </div>
    </div>
  );
};

export default YeQuoteGenerator;