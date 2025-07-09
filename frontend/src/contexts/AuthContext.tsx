import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import { authAPI, setTokens, clearTokens } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Verify token and get user data
      authAPI.getProfile()
        .then(userData => {
          setUser({
            id: userData.id,
            email: userData.email,
            name: `${userData.first_name} ${userData.last_name}`.trim(),
            role: userData.role,
            avatar: userData.avatar,
            createdAt: new Date(userData.created_at),
          });
        })
        .catch(() => {
          clearTokens();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await authAPI.login(email, password);
      setTokens(response.access, response.refresh);
      
      const userData = response.user;
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`.trim(),
        role: userData.role,
        avatar: userData.avatar,
        createdAt: new Date(userData.created_at),
      };
      
      setUser(user);
    } catch (error) {
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);

    try {
      const response = await authAPI.register({
        email: userData.email,
        username: userData.email.split('@')[0],
        first_name: userData.name.split(' ')[0],
        last_name: userData.name.split(' ').slice(1).join(' '),
        password: userData.password,
        password_confirm: userData.confirmPassword,
      });
      
      setTokens(response.access, response.refresh);
      
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: `${response.user.first_name} ${response.user.last_name}`.trim(),
        role: response.user.role,
        avatar: response.user.avatar,
        createdAt: new Date(response.user.created_at),
      };
      
      setUser(user);
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      authAPI.logout(refreshToken).catch(() => {
        // Ignore errors on logout
      });
    }
    
    setUser(null);
    clearTokens();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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