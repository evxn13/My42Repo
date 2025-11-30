import { Navigate, Outlet, useLocation } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import kanye from '../assets/KANYESMILE.jpg';

const PublicRoute = (): JSX.Element => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading && !isAuthenticated)
	 return <img src={kanye} alt="KANYE" className="w-screen h-screen object-fill" />;
	
	if (isAuthenticated)
		return <Navigate to="/" replace state={{ from: location }} />;
	
	//can return Outlet all the time instead if use nested routes in App.tsx all the time
	return <Outlet />;
};

export default PublicRoute; 