import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import axiosClient from '../../../account/utils/axiosClient';
import { useNavigate, useLocation } from 'react-router-dom';

// Interface User basée sur les définitions trouvées dans le codebase
interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  avatar?: string;
  avatarDefault?: string;
  numOfGames: number;
  wins: number;
  losses: number;
  total_score?: number;
  is2fa?: boolean;
  is_online?: boolean;
  genre?: string;
}

interface AuthContextType {
  fetchUser: () => Promise<void>;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = useCallback(async () => {
	  setIsLoading(true);
      const token = localStorage.getItem('token');
	  if (!token) {
		  setUser(null);
		  setIsAuthenticated(false);
		  setIsLoading(false);
		  return;
	  }
	  try {
		  const res = await axiosClient.get('/me');
		  if (res.data.success) {
			  setUser(res.data.user);
			  setIsAuthenticated(true);
		  } else {
			  //console.log("Backend /me returned failure, invalidating session");
			  localStorage.removeItem('token');
			  setUser(null);
			  setIsAuthenticated(false);
		  }
	  } catch (error) {
		  //console.log('failed to fetch user:', error);
		  localStorage.removeItem('token');
	 	  setUser(null);
		  setIsAuthenticated(false);
	  } finally {
		  setIsLoading(false);
	  }
  }, []);

  const login = useCallback((token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
	fetchUser();
  }, [fetchUser]); 

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false); 
  }, []);

  useEffect(() => {
	//check URL pour token de Google
	const params = new URLSearchParams(location.search);
	const urlToken = params.get('token');

	if (urlToken) {
		login(urlToken);
		navigate(location.pathname, { replace: true });
		
		return;
	}

	//check for local token
    const localToken = localStorage.getItem('token');
      if (localToken) 
		  fetchUser();
      else {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
      }
   }, [fetchUser, login, navigate, location.search, location.pathname]);

  return (
    <AuthContext.Provider value={{ fetchUser, user, isAuthenticated, isLoading, login ,logout }}>
	  {children}
	</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
