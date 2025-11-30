// **************************************************************************** //
//                                                                              //
//                                                         :::      ::::::::    //
//    AccountRegister.tsx                                :+:      :+:    :+:    //
//                                                     +:+ +:+         +:+      //
//    By: acanavat <marvin@42.fr>                    +#+  +:+       +#+         //
//                                                 +#+#+#+#+#+   +#+            //
//    Created: 2025/04/01 19:02:05 by acanavat          #+#    #+#              //
//    Updated: 2025/04/01 19:02:06 by acanavat         ###   ########.fr        //
//                                                                              //
// **************************************************************************** //

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../../website/src/assets/Background-Register.jpg';
import axiosClient        from '../utils/axiosClient';

interface FormProps {
  sendMessage: (message: string) => void;
}

const Form: React.FC<FormProps> = ({ sendMessage }) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('usernameInput') as HTMLInputElement)?.value || '';
    const email = (form.elements.namedItem('emailInput') as HTMLInputElement)?.value || '';
    const password = (form.elements.namedItem('passwordInput') as HTMLInputElement)?.value || '';
    const genre = (form.elements.namedItem('genreInput') as HTMLInputElement)?.value || '';

    // Envoi des données au backend
	try {
		const res = await axiosClient.post("/register", { username, email, password, genre });
		
		if (res.data.success)
		  sendMessage(`User ${username} registered with success !`);
		else
		  sendMessage(res.data.error || 'Error calling route register');
	} catch(err: any) {
		if (err.response) {
			if (err.response.status === 400)
				sendMessage(err.response.data.error || "Invalids inputs");
		}
		else if (err.request)
			sendMessage("❌ Impossible to connect to server.");
		else
			sendMessage("❌ bruh.");
	}
  };

  return (
    <div className="w-full px-4 pt-24 flex flex-col items-center">
      <form onSubmit={handleSubmit} id="id_form" className="w-[360px] mobile:w-full mobile:max-w-[360px]">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 mobile:p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">ARE WE YE</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="usernameInput" className="text-white/80 mb-2">Username</label>
              <input 
                type="usernameInput" 
                id="usernameInput" 
                name="usernameInput" 
                placeholder="Enter your username" 
                className="bg-white/10 text-white rounded-lg p-2 border border-white/10 focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="emailInput" className="text-white/80 mb-2">E-mail</label>
              <input 
                type="emailInput" 
                id="emailInput" 
                name="emailInput" 
                placeholder="Enter your e-mail" 
                className="bg-white/10 text-white rounded-lg p-2 border border-white/10 focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="passwordInput" className="text-white/80 mb-2">Password</label>
              <input 
                type="password" 
                id="passwordInput" 
                name="passwordInput" 
                placeholder="Enter your password" 
                className="bg-white/10 text-white rounded-lg p-2 border border-white/10 focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white/80 mb-2">Genre</label>
              <select 
                name="genreInput" 
                className="bg-white/10 text-white rounded-lg p-2 border border-white/10 focus:outline-none focus:border-white/30"
              >
                <option value="Homme" className="bg-black">Homme</option>
                <option value="YE" className="bg-black">YE</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full py-2 mt-6 rounded-full bg-white/10 text-white hover:bg-white/30 transition duration-300"
            >
              Submit
            </button>

            <div className="flex justify-center gap-x-4 text-sm w-full text-white/80 mt-4">
              Already registered ?{' '}
              <Link to="/account/login" className="text-white/80 hover:text-white underline">
                Connect
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const AccountRegister: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (messages.length > 0) {
      const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
        setMessages([]);
      }, 5000); // Efface les messages après 5 secondes
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const sendMessage = (message: string): void => {
    setMessages((prevMessages: string[]) => {
      const newMessages: string[] = [...prevMessages, message];
      // Garde seulement les 3 derniers messages
      return newMessages.slice(-3);
    });
  };

  return (
    <div className="relative overflow-x-hidden">
      <div 
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="min-h-screen w-full bg-black/50 flex flex-col items-center">
          <Form sendMessage={sendMessage} />
          
          {messages.length > 0 && (
            <div className="w-[360px] mt-8 bg-black/20 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 text-center">Message from server</h2>
              <ul className="space-y-2 text-center">
                {messages.map((msg, index) => (
                  <li key={index} className="text-white/80">{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountRegister;
