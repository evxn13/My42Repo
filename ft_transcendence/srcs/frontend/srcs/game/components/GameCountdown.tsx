// **************************************************************************** //
//                                                                              //
//                                                         :::      ::::::::    //
//    GameCountdown.tsx                                  :+:      :+:    :+:    //
//                                                     +:+ +:+         +:+      //
//    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         //
//                                                 +#+#+#+#+#+   +#+            //
//    Created: 2025/05/20 15:47:18 by isibio            #+#    #+#              //
//    Updated: 2025/05/20 15:47:19 by isibio           ###   ########.fr        //
//                                                                              //
// **************************************************************************** //

import React			from 'react';

// Interface minimale pour l'objet backendObject
interface GameCountdownProps {
	backendObject?: {
		actualValue: number;
	};
}

export const GameCountdown: React.FC<GameCountdownProps> = ({ backendObject }) => 
{
	if (backendObject === undefined)
	{
		return null;
	}

	// Si le compte à rebours est terminé (valeur 0 ou négative), on ne l'affiche pas
	if (backendObject.actualValue <= 0) {
		return null;
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<h1 style={{
				color: 'white',
				fontSize: '180px',
				transform: 'scale(1, 4)',
				fontWeight: 'bold',
				textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
			}}>
				{(backendObject.actualValue / 1000)}
			</h1>
		</div>
	);
};

// export default GameCountdown;


