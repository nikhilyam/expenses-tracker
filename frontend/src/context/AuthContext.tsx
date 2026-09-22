import { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '../utils/api';
import type { User } from '../types';

interface AuthContextValue { user: User | null; loading: boolean; authenticate: (mode: 'login' | 'register', values: Record<string, string>) => Promise<void>; logout: () => void; }
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => { 
    const stored = localStorage.getItem('ledgerly_user'); 
    return stored ? JSON.parse(stored) as User : null; 
});
  const [loading, setLoading] = useState(false);
  const authenticate = async (mode: 'login' | 'register', values: Record<string, string>) => { 
        setLoading(true); 
        try { 
            const { data } = await api.post(`/auth/${mode}`, values); 
            localStorage.setItem('ledgerly_token', data.data.token); 
            localStorage.setItem('ledgerly_user', JSON.stringify(data.data.user)); 
            setUser(data.data.user); 
        } finally { 
            setLoading(false); 
        } 
    };
  const logout = () => { 
    localStorage.removeItem('ledgerly_token'); 
    localStorage.removeItem('ledgerly_user'); 
    setUser(null); 
  };

  return <AuthContext.Provider value={{ user, loading, authenticate, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => { 
    const context = useContext(AuthContext); 
    if (!context) throw new Error('useAuth must be used inside AuthProvider'); 
    return context; 
};
