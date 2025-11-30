/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Ball.tsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tpicoule <tpicoule@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/20 18:03:46 by isibio            #+#    #+#             */
/*   Updated: 2025/06/27 04:17:31 by tpicoule         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React	from 'react';

// Interface minimale pour le point utilisé dans le rendu
interface BallPoint {
	posX: number;
	posY: number;
	size: number;
}

// Interface minimale pour l'objet backendObject
interface BallProps {
	backendObject?: {
		point: BallPoint;
	};
}

export const Ball: React.FC<BallProps> = ({ backendObject }) => 
{
	if (backendObject === undefined)
	{
		return (
			<div
				className="Ball"
				style=
				{{
					position:			"fixed",
					backgroundColor:	"#0a0a0a",
					borderRadius:		"100%",
					width:				"20px",
					height:				"20px",
					left:				"0px",
					top:				"0px",
					boxShadow:			"0 0 30px #ffffff, 0 0 60px #f0f0f0, inset 0 0 25px #ffffff",
					background:			"radial-gradient(circle at 30% 30%, #1a1a1a, #000000)",
					border:				"2px solid #ffffff",
					animation:			"pulse 2s infinite"
				}}
			/>
		);
	}

	return (
		<div
			className="Ball"
			style=
			{{
				position:			"fixed",
				backgroundColor:	"#0a0a0a",
				borderRadius:		"100%",
				width:				backendObject.point.size + "px",
				height:				backendObject.point.size + "px",
				left:				(backendObject.point.posX - (backendObject.point.size / 2)) + "px",
				top:				(backendObject.point.posY - (backendObject.point.size / 2)) + "px",
				boxShadow:			"0 0 30px #ffffff, 0 0 60px #f0f0f0, inset 0 0 25px #ffffff",
				background:			"radial-gradient(circle at 30% 30%, #1a1a1a, #000000)",
				border:				"2px solid #ffffff",
				animation:			"pulse 2s infinite"
			}}
		/>
	);
};

// style d'animation
const style = document.createElement('style');
style.textContent = `
@keyframes pulse {
	0% {
		box-shadow: 0 0 30px #ffffff, 0 0 60px #f0f0f0, inset 0 0 25px #ffffff;
	}
	50% {
		box-shadow: 0 0 40px #ffffff, 0 0 80px #f0f0f0, inset 0 0 35px #ffffff;
	}
	100% {
		box-shadow: 0 0 30px #ffffff, 0 0 60px #f0f0f0, inset 0 0 25px #ffffff;
	}
}`;
document.head.appendChild(style);

export default Ball;
