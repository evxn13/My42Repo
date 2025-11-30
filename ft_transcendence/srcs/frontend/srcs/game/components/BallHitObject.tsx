// **************************************************************************** //
//                                                                              //
//                                                         :::      ::::::::    //
//    BallHitObject.tsx                                  :+:      :+:    :+:    //
//                                                     +:+ +:+         +:+      //
//    By: isibio <isibio@student.42.fr>              +#+  +:+       +#+         //
//                                                 +#+#+#+#+#+   +#+            //
//    Created: 2025/05/21 13:55:01 by isibio            #+#    #+#              //
//    Updated: 2025/05/21 13:55:02 by isibio           ###   ########.fr        //
//                                                                              //
// **************************************************************************** //

import React			from 'react';
import { useRef }		from 'react';
import { useEffect }	from 'react';
import Sound1			from '../../website/src/assets/1mesure.mp3';
import Sound2			from '../../website/src/assets/2mesure.mp3';
import Sound3			from '../../website/src/assets/3mesure.mp3';
import Sound4			from '../../website/src/assets/4mesures.mp3';

let currentSound = 0;

interface BallHitObjectProps {
	backendObject?: {
	};
}

export const BallHitObject: React.FC<BallHitObjectProps> = ({ backendObject }) => 
{
	if (backendObject === undefined)
	{
		return (
			<h1>backendObject is undefined</h1>
		);
	}

	const audioRefs = useRef<HTMLAudioElement[]>([]);

	// creating the audios only once
	useEffect(() => {
		audioRefs.current = [
			new Audio(Sound1),
			new Audio(Sound2),
			new Audio(Sound3),
			new Audio(Sound4)
		];

		// preloading audios
		audioRefs.current.forEach(audio => {
			audio.load();
		});
	}, []);

	useEffect(() => {
		if (!backendObject) return;

		const sound = audioRefs.current[currentSound];
		if (sound)
		{
			// play the audio from start
			sound.currentTime = 0;
			sound.play().catch(err => console.log("Something went wrong playing the audio..."));
			currentSound = (currentSound + 1) % audioRefs.current.length;
		}
	}, [backendObject]);

	return <></>;
};
