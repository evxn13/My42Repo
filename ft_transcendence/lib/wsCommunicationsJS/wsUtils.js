// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   wsUtils.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: isibio <isibio@student.42.fr>              +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/23 19:06:10 by isibio            #+#    #+#             //
//   Updated: 2025/05/23 19:06:11 by isibio           ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export function throwAndReturn(toReturn, toThrow, throwException = true)
{
	if (throwException)
		throw (toThrow);
	return (toReturn);
}
