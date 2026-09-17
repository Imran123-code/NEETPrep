import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('neetprep_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const register = async ({ name, email, password, targetClass, studentClass, targetYear }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const users = JSON.parse(localStorage.getItem('neetprep_users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    const resolvedClass = targetClass || studentClass || '12th';
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      targetClass: resolvedClass,
      targetYear,
      createdAt: new Date().toISOString(),
      avatar: name ? name.charAt(0).toUpperCase() : 'U',
    };
    users.push(newUser);
    localStorage.setItem('neetprep_users', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem('neetprep_user', JSON.stringify(safeUser));
    return { success: true };
  };

  const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const users = JSON.parse(localStorage.getItem('neetprep_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password' };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('neetprep_user', JSON.stringify(safeUser));
    return { success: true };
  };

  const loginAsDemo = async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const demoUser = {
      id: 'demo-user-123',
      name: 'Demo Student',
      email: 'demo@neetprep.com',
      targetClass: 'Class 12',
      targetYear: '2025',
      avatar: 'D',
      createdAt: new Date().toISOString(),
    };
    setUser(demoUser);
    localStorage.setItem('neetprep_user', JSON.stringify(demoUser));
    return { success: true };
  };

  const updateProfile = async (updates) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (!user) return { success: false, error: 'No user logged in' };

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('neetprep_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('neetprep_users') || '[]');
    const index = users.findIndex(u => u.id === user.id || u.email === user.email);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem('neetprep_users', JSON.stringify(users));
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('neetprep_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginAsDemo, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
