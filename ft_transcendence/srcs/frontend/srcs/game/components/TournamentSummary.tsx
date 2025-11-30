/* **************************************************************************** */
/*                                                                              */
/*                                                         :::      ::::::::    */
/*    TournamentSummary.tsx                              :+:      :+:    :+:    */
/*                                                     +:+ +:+         +:+      */
/*    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         */
/*                                                 +#+#+#+#+#+   +#+            */
/*    Created: 2025/06/13 16:22:27 by isibio            #+#    #+#              */
/*    Updated: 2025/06/13 16:22:29 by isibio           ###   ########.fr        */
/*                                                                              */
/* **************************************************************************** */

import TournamentSummaryWS from '/lib/transcendence/wsCommunicationsJS/tournament/TournamentSummaryWS.js';

// import React				from 'react';
// import axiosClient 			from '../../account/utils/axiosClient';

// export const TournamentSummary = ({backendObject}) => 
// {
// 	if (backendObject === undefined)
// 		return (null);

// 	let ranckingOrder = backendObject.getClientByRanckingArr(false);


// 	let getArray = async function()
// 	{
// 		let array = [];
// 		let index = -1;

// 		for (let clientData of ranckingOrder)
// 		{
// 			let username;
// 			index++;
// 			let userId = clientData.userDetails.userId;
// 			const res = await axiosClient.get('/me', userId);
// 	                if (res.data.success)
// 	            		username = res.data.user.username;
// 	                else
// 	                    console.error(res.data.error || "ERREUR GETTING ID TOURNAMENT");

// 			array[index] =	<div key={index}>
// 								{clientData.isVictory ? (
// 									<>
// 										<h1 className="text-4xl font-bold text-white mb-4">🏆 Félicitations {username} ! 🏆</h1>
// 										<p className="text-white/80 text-xl mb-6">Vous avez remporté le tournoi !</p>
// 									</>
// 								) : (
// 									<div className="text-white/90 text-lg mt-2">
// 										{username} → Éliminé au round {clientData.maxRoundPlayed}
// 									</div>
// 								)}
// 							</div>;
// 		}
// 		return (array);
// 	}

// 	let array = getArray();
// 	return (
// 		<div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
// 			<div className="bg-white/10 border-2 border-white/50 rounded-xl p-8 text-center">
// 				{array}
// 			</div>
// 		</div>
// 	);
// };

import React, { useEffect, useState } from 'react';
import axiosClient from '../../account/utils/axiosClient';

// Interfaces minimales pour les données utilisées
interface ClientData {
	userDetails: {
		userId: string;
	};
	isVictory: boolean;
	maxRoundPlayed: number;
}

interface TournamentSummaryProps {
	backendObject?: {
		getClientByRanckingArr: (desc: boolean) => ClientData[];
		tournamentEndReason?: string;
	};
}

export const TournamentSummary: React.FC<TournamentSummaryProps> = ({ backendObject }) => {
	const [array, setArray] = useState<React.ReactElement[]>([]);

	useEffect(() => {
		if (!backendObject) return;

		const ranckingOrder = backendObject.getClientByRanckingArr(false);

		const getArray = async () => {
			let newArray: React.ReactElement[] = [];

			for (let index = 0; index < ranckingOrder.length; index++) {
				let clientData = ranckingOrder[index];		
				let id = clientData.userDetails.userId;
				let username;
				try {
					const res = await axiosClient.get('/meID', { params: { userId: id } });
					if (res.data.success)
						username = res.data.user.username;
					else
						console.error(res.data.error || "ERREUR GETTING ID TOURNAMENT");
				} catch (err) {
					console.error("Axios error:", err);
				}

				newArray[index] = (
					<div key={index}>
						{clientData.isVictory ? (
							<>
								<h1 className="text-4xl font-bold text-white mb-4">🏆 Congratulations {username} ! 🏆</h1>
								<p className="text-white/80 text-xl mb-6">You won the tournament !</p>
							</>
						) : (
							<div className="text-white/90 text-lg mt-2">
								{username} → Eliminated round {clientData.maxRoundPlayed}
							</div>
						)}
					</div>
				);
			}

			setArray(newArray); // update state to trigger render
		};

		getArray();
	}, [backendObject]);

	if (
		backendObject &&
		backendObject.tournamentEndReason === TournamentSummaryWS.tournamentEndPlayersNotUnique
	) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
				<div className="bg-white/10 border-2 border-white/50 rounded-xl p-8 text-center">
					<div className="text-white/90 text-lg mt-2">
						I hate being Bi-Polar it's awesome
					</div>
				</div>
			</div>
		);
	}

	if (!backendObject) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
			<div className="bg-white/10 border-2 border-white/50 rounded-xl p-8 text-center">
				{array}
			</div>
		</div>
	);
};


// import React, { useEffect, useState } from 'react';           //less AWAITS/ASYNCS but slower to display
// import axiosClient from '../../account/utils/axiosClient';

// export const TournamentSummary = ({ backendObject }) => {
// 	const [array, setArray] = useState([]);

// 	useEffect(() => {
// 		if (!backendObject) return;

// 		const ranckingOrder = backendObject.getClientByRanckingArr(false);
// 		const elements = [];

// 		let completed = 0;

// 		ranckingOrder.forEach((clientData, index) => {
// 			const userId = clientData.userDetails.userId;

// 			axiosClient.get('/me', userId).then(res => {
// 				let username = userId;
// 				if (res.data.success)
// 					username = res.data.user.username;

// 				const element = (
// 					<div key={index}>
// 						{clientData.isVictory ? (
// 							<>
// 								<h1 className="text-4xl font-bold text-white mb-4">🏆 Félicitations {username} ! 🏆</h1>
// 								<p className="text-white/80 text-xl mb-6">Vous avez remporté le tournoi !</p>
// 							</>
// 						) : (
// 							<div className="text-white/90 text-lg mt-2">
// 								{username} → Éliminé au round {clientData.maxRoundPlayed}
// 							</div>
// 						)}
// 					</div>
// 				);

// 				elements[index] = element;
// 				completed++;

// 				// When all usernames are loaded, update state
// 				if (completed === ranckingOrder.length) {
// 					setArray(elements);
// 				}
// 			}).catch(err => {
// 				console.error('Erreur Axios:', err);
// 			});
// 		});
// 	}, [backendObject]);

// 	if (!backendObject) return null;

// 	return (
// 		<div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
// 			<div className="bg-white/10 border-2 border-white/50 rounded-xl p-8 text-center">
// 				{array}
// 			</div>
// 		</div>
// 	);
// };
