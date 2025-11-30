// **************************************************************************** //
//                                                                              //
//                                                         :::      ::::::::    //
//    HitLine.tsx                                        :+:      :+:    :+:    //
//                                                     +:+ +:+         +:+      //
//    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         //
//                                                 +#+#+#+#+#+   +#+            //
//    Created: 2025/04/10 19:58:52 by isibio            #+#    #+#              //
//    Updated: 2025/04/10 19:58:53 by isibio           ###   ########.fr        //
//                                                                              //
// **************************************************************************** //

import React from 'react';

// Interface minimale pour les points utilisés
interface HitPoint {
	posX: number;
	posY: number;
}

// Interface minimale pour l'objet backendObject
interface HitLineProps {
	backendObject?: {
		startPoint: HitPoint;
		endPoint: HitPoint;
	};
}

export const HitLine: React.FC<HitLineProps> = ({ backendObject }) => {
	if (backendObject === undefined) {
		return <h1>backendObject is undefined</h1>;
	}

	return (
		<>
			<div
				className="HitPointStart"
				style={{
					position: 'fixed',
					backgroundColor: '#0000ff',
					borderRadius: '0%',
					left: backendObject.startPoint.posX + 'px',
					top: backendObject.startPoint.posY + 'px',
					width: '5px',
					height: '5px',
				}}
			/>

			<div
				className="HitPointEnd"
				style={{
					position: 'fixed',
					backgroundColor: '#0000ff',
					borderRadius: '0%',
					left: backendObject.endPoint.posX + 'px',
					top: backendObject.endPoint.posY + 'px',
					width: '5px',
					height: '5px',
				}}
			/>
		</>
	);
};
