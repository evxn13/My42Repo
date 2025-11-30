// **************************************************************************** //
//                                                                              //
//                                                         :::      ::::::::    //
//    Point.tsx                                          :+:      :+:    :+:    //
//                                                     +:+ +:+         +:+      //
//    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         //
//                                                 +#+#+#+#+#+   +#+            //
//    Created: 2025/04/12 10:52:58 by isibio            #+#    #+#              //
//    Updated: 2025/04/12 10:52:59 by isibio           ###   ########.fr        //
//                                                                              //
// **************************************************************************** //

import React from 'react';

// Interface minimale pour l'objet backendObject
interface PointProps {
	backendObject?: {
		posX: number;
		posY: number;
		size: number;
	};
}

export const Point: React.FC<PointProps> = ({ backendObject }) => {
	if (backendObject === undefined) {
		return (
			<div
				className="Point"
				style={{
					position: 'fixed',
					backgroundColor: '#000FFF',
					borderRadius: '100%',
					width: '20px',
					height: '20px',
					left: '0px',
					top: '0px',
				}}
			/>
		);
	}

	return (
		<>
			<div
				className="Point"
				style={{
					position: 'fixed',
					backgroundColor: '#20FF20',
					borderRadius: '100%',
					width: backendObject.size + 'px',
					height: backendObject.size + 'px',
					left: backendObject.posX - backendObject.size / 2 + 'px',
					top: backendObject.posY - backendObject.size / 2 + 'px',
				}}
			/>
		</>
	);
};

