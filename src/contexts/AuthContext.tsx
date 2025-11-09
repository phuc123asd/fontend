import React, { useEffect, useState, createContext, useContext } from 'react';
interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  const login = async (email: string, _password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Demo: admin@example.com with any password logs in as admin
    if (email === 'admin@example.com') {
      setUser({
        id: 1,
        name: 'Admin User',
        email: email,
        role: 'admin',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      });
    } else {
      setUser({
        id: 2,
        name: email.split('@')[0],
        email: email,
        role: 'customer',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
      });
    }
  };
  const register = async (name: string, email: string, _password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({
      id: Date.now(),
      name: name,
      email: email,
      role: 'customer',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    });
  };
  const logout = () => {
    setUser(null);
  };
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({
        ...user,
        ...updates
      });
    }
  };
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';
  return <AuthContext.Provider value={{
    user,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin
  }}>
      {children}
    </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};