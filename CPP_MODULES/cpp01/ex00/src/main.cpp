/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: evscheid <evscheid@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/20 17:02:41 by evscheid          #+#    #+#             */
/*   Updated: 2023/11/20 17:02:41 by evscheid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Zombie.hpp"

int main(void)
{
    Zombie* heapZombie = newZombie("Evan Zombie");
    heapZombie->announce();
    delete heapZombie;
    randomChump("42 Zombie");
    return 0;
}
