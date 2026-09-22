import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { App } from './App';
import './styles.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><AuthProvider><App /></AuthProvider><Toaster position="top-right" toastOptions={{ style: { background: '#17211b', color: '#f6f3ea' } }} /></React.StrictMode>);
