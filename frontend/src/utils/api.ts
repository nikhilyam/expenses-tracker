import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api' });
api.interceptors.request.use((config) => { 
    const token = localStorage.getItem('ledgerly_token'); 
    if (token) config.headers.Authorization = `Bearer ${token}`; 
    return config; 
});

api.interceptors.response.use((response) => response, (error) => { 
    if (error.response?.status === 401) { 
        localStorage.removeItem('ledgerly_token'); 
        localStorage.removeItem('ledgerly_user'); 
    } return Promise.reject(error); });
    
export const errorMessage = (error: unknown): string => axios.isAxiosError(error) ? error.response?.data?.message ?? 'Request failed.' : 'Something went wrong.';
