// **************************************************************************** //
//                                                                              //
//                                                         :::      ::::::::    //
//    RoundDetails.tsx                                   :+:      :+:    :+:    //
//                                                     +:+ +:+         +:+      //
//    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         //
//                                                 +#+#+#+#+#+   +#+            //
//    Created: 2025/06/19 14:44:08 by isibio            #+#    #+#              //
//    Updated: 2025/06/19 14:44:08 by isibio           ###   ########.fr        //
//                                                                              //
// **************************************************************************** //

import React, {useEffect, useState}			from 'react';
import axiosClient from '../../account/utils/axiosClient';

interface RoundDetailsProps {
	backendObject?: any;
}

export const RoundDetails: React.FC<RoundDetailsProps> = ({ backendObject }) => {
	const [username, setUsername] = useState<string>();
	const [array, setArray] = useState<(string | number)[]>([]);
	useEffect(() => {
		if (backendObject === undefined)
			return;

		const getRoundDetails = async () => {
			const res: (string | number)[] = [];

			res[0] = backendObject.roundNb;
			let posi = 1;
			for (let matchDetails of backendObject.matchDetailsArr)
			{
				let user;
				for (let userDetails of matchDetails.userDetailsArr)
				{
					try {
						const res = await axiosClient.get('/meID', { params: { userId: userDetails.userId } });

						if (res.data.success)
						{
							user = res.data.user.username;
							setUsername(user);
						}
						else
							console.error(res.data.error || "ERROR GETTING ID TOURNAMENT");
					} catch (err) {
						console.error("Axios error:", err);
					}
					res[posi] = user;
					posi++;
				}
			}
			setArray(res);
		}
		getRoundDetails();
	}, [backendObject]);
	// ARRAY[0] = LE ROUND NUMBER
	// ARRAY[1] = PLAYER 1 vs ARRAY[2] = PLAYER 2, etc...
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
			<div className="bg-white/10 border-2 border-white/50 rounded-xl p-8 text-center">
				<div className="text-2xl font-bold mb-4">Round number {array[0]}</div>
				{(() => {
					const res: React.ReactElement[] = [];
					for (let i = 1; i < array.length; i += 2) {
						res.push(
							<div key={i} className="text-xl mb-2">
								{array[i]} vs {array[i + 1]}
							</div>
						);
					}
					return res;
				})()}
			</div>
		</div>
	);
};

export default RoundDetails;
