import React, { useEffect, useState, createContext, useContext } from 'react';

interface User {
  id: string; // id từ MongoDB là dạng string
  name?: string;
  email: string;
  role?: 'customer' | 'admin';
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

 // ✅ LOGIN (API thật)
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/customer/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.message !== 'Login successful') {
        throw new Error(data.error || 'Email hoặc mật khẩu không đúng');
      }

      // 🔹 Nếu chưa có avatar -> tạo avatar mặc định dựa trên email
      const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`;

      setUser({
        id: data.id,
        email,
        role: 'customer',
        avatar: avatarUrl,
      });
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  // ✅ REGISTER - gọi API thật
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/customer/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          first_name: name,
          last_name: '',
          phone: '',
          address: '',
          city: '',
          province: '',
          postal_code: '',
        }),
      });

      const data = await response.json();

      if (!response.ok || data.message !== 'User registered successfully') {
        throw new Error(data.error || 'Đăng ký thất bại');
      }

      const newUser: User = {
        id: data.id,
        name,
        email,
        role: 'customer',
      };

      setUser(newUser);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) setUser({ ...user, ...updates });
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateUser, isAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
