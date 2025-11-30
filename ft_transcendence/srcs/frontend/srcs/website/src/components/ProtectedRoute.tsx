import BackendWsProvider from '../../../game/context/BackendWsContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import kanye from '../assets/KANYESMILE.jpg';
import { NotificationProvider } from './../components/layout/NotificationContext';
import NotificationBell from './../components/layout/NotificationBell';

const ProtectedRoute = (): JSX.Element => {
  if (import.meta.env.VITE_DOCKERDEBUG === "true")
    return (
      <BackendWsProvider>
        <Outlet />
      </BackendWsProvider>
    );

  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading && !isAuthenticated)
    return <img src={kanye} alt="KANYE" className="w-screen h-screen object-fill" />;

  if (!isAuthenticated)
    return <Navigate to="/account/login" replace state={{ from: location }} />;

  return (
    <NotificationProvider>
      <BackendWsProvider>
        {!location.pathname.startsWith('/chat') && !location.pathname.startsWith('/account/login') && !location.pathname.startsWith('/account/register') && <NotificationBell />}
        <Outlet />
      </BackendWsProvider>
    </NotificationProvider>
  );
};

export default ProtectedRoute;
