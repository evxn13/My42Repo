import axios, { AxiosResponse, AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = `https://${import.meta.env.VITE_HOST_TRANSCENDENCE}:${import.meta.env.VITE_PORT_NGINX}/api`;

const axiosClient = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-type': 'application/json' },
});

//this is called before every axiosClient.post to add token if needed
axiosClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token)
			config.headers.Authorization = `Bearer ${token}`;
		return (config);
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

//inbetween the called route is executed in the backend

//this is called when the backend has responded, the response goes through here before it sent to front (we only check for the error type)
axiosClient.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	(error: AxiosError) => {
		//checking for response object
		if (error.response) {
			const { status } = error.response;
			if (status === 403) {
				console.warn(`Authentication error (${status}):`, (error.response.data as any)?.error);
				localStorage.removeItem('token');
				//const navigate = useNavigate();
				//navigate('/account/login?reason=session_expired'); //THIS CREATED A INVALID HOOK CALL
			}
		}
		return Promise.reject(error);
	}
);

export default axiosClient;
