// **************************************************************************** //
//                                                                              //
//                                                         :::      ::::::::    //
//    BoardWall.tsx                                      :+:      :+:    :+:    //
//                                                     +:+ +:+         +:+      //
//    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         //
//                                                 +#+#+#+#+#+   +#+            //
//    Created: 2025/04/15 12:30:12 by isibio            #+#    #+#              //
//    Updated: 2025/04/15 12:30:15 by isibio           ###   ########.fr        //
//                                                                              //
// **************************************************************************** //

import React		from 'react';

// Interface minimale pour le point utilisé
interface WallPoint {
	posX: number;
	posY: number;
}

// Interface minimale pour hitLine
interface HitLineType {
	startPoint: WallPoint;
	endPoint: WallPoint;
}

// Interface minimale pour l'objet backendObject
interface BoardWallProps {
	backendObject?: {
		hitLine: HitLineType;
	};
}

export const BoardWall: React.FC<BoardWallProps> = ({ backendObject }) => 
{
	if (backendObject === undefined)
	{
		return (
			<h1>backendObject is undefined</h1>
		);
	}

	// Calcul de la position et des dimensions du mur
	const startX = backendObject.hitLine.startPoint.posX;
	const startY = backendObject.hitLine.startPoint.posY;
	const endX = backendObject.hitLine.endPoint.posX;
	const endY = backendObject.hitLine.endPoint.posY;

	// DAAAMN longueur et angle du mur !cmpri
	const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
	const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

	return (
		<>
			<style>
				{`
				.wall-pulse {
					animation: wallPulse 2s infinite;
				}
				@keyframes wallPulse {
					0% {
						box-shadow: 0 0 20px #ffffff, 0 0 40px #f0f0f0, inset 0 0 15px #ffffff;
					}
					50% {
						box-shadow: 0 0 30px #ffffff, 0 0 60px #f0f0f0, inset 0 0 25px #ffffff;
					}
					100% {
						box-shadow: 0 0 20px #ffffff, 0 0 40px #f0f0f0, inset 0 0 15px #ffffff;
					}
				}
				`}
			</style>
			<div
				className="BoardWall wall-pulse"
				style={{
					position: "fixed",
					backgroundColor: "#0a0a0a",
					width: length + "px",
					height: "6px",
					left: startX + "px",
					top: startY + "px",
					transform: `rotate(${angle}deg)`,
					transformOrigin: "0 0",
					boxShadow: "0 0 20px #ffffff, 0 0 40px #f0f0f0, inset 0 0 15px #ffffff",
					background: "radial-gradient(circle at 30% 30%, #1a1a1a, #000000)",
					border: "1px solid #ffffff",
					borderRadius: "3px"
				}}
			/>
			{/* <HitLine backendObject={backendObject.hitLine} /> */}
		</>
	);
};

export default BoardWall;

	