// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: acanavat <marvin@42.fr>                    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/25 16:27:40 by acanavat          #+#    #+#             //
//   Updated: 2025/04/25 16:27:41 by acanavat         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { ServerAI }	from './ServerAI.js';

let	listeningPort	= parseInt(process.env.EXPOSED_PORT);
let serverAI		= new ServerAI(listeningPort);
serverAI.launchServer();


//pastouche()
// let aiManager = new acanavatAI("ass");
// aiManager.start();