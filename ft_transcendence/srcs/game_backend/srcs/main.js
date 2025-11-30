// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/01/27 12:53:11 by isibio            #+#    #+#             //
//   Updated: 2025/01/27 12:53:12 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { GameBackend }		from './GameBackend.js';

let	listeningPort = parseInt(process.env.EXPOSED_PORT);
let gameBackend = new GameBackend(listeningPort);
gameBackend.launchServer();
