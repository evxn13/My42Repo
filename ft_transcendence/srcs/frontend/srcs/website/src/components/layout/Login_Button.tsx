import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login_Button: React.FC = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate('/game')}
      className="tracking-widest px-6 py-2 rounded-full bg-white/10 text-white"
      type="button"
    >
      Don't Click
    </button>
  );
};

export default Login_Button;