// **************************************************************************** //
//                                                                              //
//                                                         :::      ::::::::    //
//    PaddleHitLine.tsx                                  :+:      :+:    :+:    //
//                                                     +:+ +:+         +:+      //
//    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         //
//                                                 +#+#+#+#+#+   +#+            //
//    Created: 2025/04/17 13:33:35 by isibio            #+#    #+#              //
//    Updated: 2025/04/17 13:33:36 by isibio           ###   ########.fr        //
//                                                                              //
// **************************************************************************** //

import React from 'react';

// Interface minimale pour l'objet backendObject
interface PaddleHitLineProps {
	backendObject?: {
		hitLine?: any;
	};
}

export const PaddleHitLine: React.FC<PaddleHitLineProps> = ({ backendObject }) => {
	if (backendObject === undefined) {
		return <h1>backendObject is undefined</h1>;
	}

	return (
		<>
			<div>
				{/* <HitLine backendObject={backendObject.hitLine} /> */}
			</div>
		</>
	);
};


