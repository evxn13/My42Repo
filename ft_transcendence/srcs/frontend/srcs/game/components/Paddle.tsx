/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Paddle.tsx                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tpicoule <tpicoule@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/20 18:03:46 by isibio            #+#    #+#             */
/*   Updated: 2025/06/19 15:10:35 by tpicoule         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React				from 'react';
import { PaddleHitLine }		from './PaddleHitLine.tsx';

// Interface minimale pour les points utilisés
interface PaddlePoint {
	posX: number;
	posY: number;
}

// Interface minimale pour hitLine
interface HitLineType {
	startPoint: PaddlePoint;
	endPoint: PaddlePoint;
}

// Interface minimale pour PaddleHitLine
interface PaddleHitLineType {
	id: string;
	hitLine: HitLineType;
}

// Interface minimale pour l'objet backendObject
interface PaddleProps {
	backendObject?: {
		hitLineArr: PaddleHitLineType[];
	};
}

export const Paddle: React.FC<PaddleProps> = ({ backendObject }) => 
{
	if (backendObject === undefined)
	{
		return (
			<h1>backendObject is undefined</h1>
		);
	}

	let hitLineArr: React.ReactElement[] = [];
	for (let i = 0; i < backendObject.hitLineArr.length; ++i)
		hitLineArr[i] = <PaddleHitLine key={backendObject.hitLineArr[i].id} backendObject={backendObject.hitLineArr[i]} />;

	// Calcul de la position du paddle
	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;

	for (let hitLine of backendObject.hitLineArr) {
		minX = Math.min(minX, hitLine.hitLine.startPoint.posX, hitLine.hitLine.endPoint.posX);
		maxX = Math.max(maxX, hitLine.hitLine.startPoint.posX, hitLine.hitLine.endPoint.posX);
		minY = Math.min(minY, hitLine.hitLine.startPoint.posY, hitLine.hitLine.endPoint.posY);
		maxY = Math.max(maxY, hitLine.hitLine.startPoint.posY, hitLine.hitLine.endPoint.posY);
	}

	const width = maxX - minX;
	const height = maxY - minY;

	return (
		<>
			<style>
				{`
				.paddle-pulse {
					animation: paddlePulse 2s infinite;
				}
				@keyframes paddlePulse {
					0% {
						box-shadow: 0 0 30px #ffffff, 0 0 60px #f0f0f0, inset 0 0 25px #ffffff;
					}
					50% {
						box-shadow: 0 0 40px #ffffff, 0 0 80px #f0f0f0, inset 0 0 35px #ffffff;
					}
					100% {
						box-shadow: 0 0 30px #ffffff, 0 0 60px #f0f0f0, inset 0 0 25px #ffffff;
					}
				}
				`}
			</style>
			<div
				className="Paddle paddle-pulse"
				style={{
					position: "fixed",
					backgroundColor: "#0a0a0a",
					borderRadius: "10%",
					width: width + "px",
					height: height + "px",
					left: minX + "px",
					top: minY + "px",
					boxShadow: "0 0 30px #ffffff, 0 0 60px #f0f0f0, inset 0 0 25px #ffffff",
					background: "radial-gradient(circle at 30% 30%, #1a1a1a, #000000)",
					border: "2px solid #ffffff"
				}}
			/>
			{hitLineArr}
		</>
	);
};

export default Paddle;
