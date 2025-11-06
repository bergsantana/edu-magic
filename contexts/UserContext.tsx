"use client";

import React, { createContext, useContext,  useEffect,  useState } from "react";
import { useRouter } from "next/navigation";
//port { cookies } from "next/headers";

interface User {
  id: string;
name: string;   
  email: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  apiCall: (url: string, options?: RequestInit) => Promise<Response>;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Get token from cookies
  const getAuthToken = (): string | null => {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('auth-token=')
    );
    
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
    
    return null;
  };

  const setLocalUser = (userData: User) => { 
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const getLocalUser = (): User | null => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  // Set token in cookies
  const setAuthToken = async  (token: string) => {
    document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
    // const cookiesStore = await cookies()
    // cookiesStore.set('edu-magic-auth-token', token, { path: '/', maxAge: 7 * 24 * 60 * 60, sameSite: 'strict' });
  };

  // Clear token from cookies
  const clearAuthToken = () => {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  // Verify token and get user data
//   const verifyToken = async (token: string): Promise<User | null> => {
//     try {
//       const response = await fetch('/api/verify-token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ token }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         return data.user;
//       }
//     } catch (error) {
//       console.error('Token verification failed:', error);
//     }
    
//     return null;
//   };

  // API call wrapper that includes authentication
  const apiCall = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
     try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('login response data:', data);
      if (response.ok) {
        setAuthToken(data.token);
        setUser(data.user);
        setLocalUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Erro ao fazer login' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
    
        return { success: true };
      } else {
        return { success: false, error: (data.error || 'Erro ao criar conta') + data.message,  };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    
    clearAuthToken();
      localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  // Check authentication on mount and token changes
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = getAuthToken();
      
//       if (token) {
//         const userData = await verifyToken(token);
//         if (userData) {
//           setUser(userData);
//         } else {
//           clearAuthToken();
//         }
//       }
      
//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

  // Check local user on mount
 
 
  const contextValue: UserContextType = {
    user,
    loading,
    setLoading,
    login,
    signup,
    logout,
    apiCall,
    isAuthenticated: !!user,
  };

  useEffect(() => {
    const checkLocalUser = async () => {
      const localUser = await getLocalUser();
      if (localUser) {
        setUser(localUser);
      }
    setLoading(false);
  };
  checkLocalUser();
  }, []);
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};