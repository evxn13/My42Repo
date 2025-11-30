// **************************************************************************** //
//                                                                              //
//                                                         :::      ::::::::    //
//    ClientRoomData.tsx                                 :+:      :+:    :+:    //
//                                                     +:+ +:+         +:+      //
//    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         //
//                                                 +#+#+#+#+#+   +#+            //
//    Created: 2025/05/22 18:01:23 by isibio            #+#    #+#              //
//    Updated: 2025/05/22 18:01:23 by isibio           ###   ########.fr        //
//                                                                              //
// **************************************************************************** //

import React			from 'react';

// Interface minimale pour les props
interface ClientRoomDataProps {
	backendObject?: unknown;
	playerNumber?: number;
}

export const ClientRoomData: React.FC<ClientRoomDataProps> = ({ backendObject, playerNumber }) => 
{
	if (backendObject === undefined)
		return (null);

	return (
		<div>
		</div>
	);
};

export default ClientRoomData;

