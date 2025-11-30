// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Board.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/20 18:03:46 by isibio            #+#    #+#             //
//   Updated: 2025/03/20 18:03:48 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import React			from 'react';
import { BoardWall }	from '../components/BoardWall.tsx';

// Interface minimale pour l'objet backendObject
interface BoardWallType {
	id: string;
	hitLine: {
		startPoint: { posX: number; posY: number; };
		endPoint: { posX: number; posY: number; };
	};
}

interface BoardProps {
	backendObject?: {
		wallArr: BoardWallType[];
	};
}

export const Board: React.FC<BoardProps> = ({ backendObject }) => 
{
	if (backendObject === undefined)
	{
		return (
			<h1>backendObject is undefined</h1>
		);
	}

	let wallArr: React.ReactElement[] = [];
	for (let i = 0; i < backendObject.wallArr.length; ++i)
		wallArr[i] = <BoardWall key={backendObject.wallArr[i].id} backendObject={backendObject.wallArr[i]} />;

	return (
		<>
			{wallArr}
		</>
	);
};

// export default Board;
