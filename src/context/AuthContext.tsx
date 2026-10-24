import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface StoredUser extends AuthUser {
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUserRole: (userId: string, role: 'admin' | 'user') => void;
  deleteUser: (userId: string) => void;
  isAdmin: boolean;
  users: AuthUser[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'athenaeum_users';
const SESSION_KEY = 'athenaeum_session';

const seedUsers: StoredUser[] = [
  { id: 'admin-1', name: 'Curator-in-Chief', email: 'admin@athenaeum.library', password: 'admin123', role: 'admin' },
  { id: 'user-sample-1', name: 'Elena Rostova', email: 'elena.rostova@oxford.edu', password: 'reader123', role: 'user' },
  { id: 'user-sample-2', name: 'Dr. Tariq Mansoor', email: 'tariq.mansoor@sorbonne.fr', password: 'reader123', role: 'user' },
  { id: 'user-sample-3', name: 'Sophia Chen', email: 'sophia.chen@mit.edu', password: 'reader123', role: 'user' },
  { id: 'user-sample-4', name: 'Mateo Rossi', email: 'mateo.rossi@bologna.it', password: 'reader123', role: 'user' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<StoredUser[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredUser[];
        if (Array.isArray(parsed) && parsed.length) {
          const valid = parsed.filter((u) =>
            u && typeof u.id === 'string' && typeof u.email === 'string' && typeof u.password === 'string' && typeof u.role === 'string'
          );
          if (valid.length) return valid as StoredUser[];
        }
      }
    } catch { /* ignore */ }
    return seedUsers;
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        if (parsed && typeof parsed.id === 'string' && typeof parsed.email === 'string') {
          // Validate session user exists in the users table (prevent tampering)
          const storedUsers = localStorage.getItem(STORAGE_KEY);
          if (storedUsers) {
            try {
              const usersList = JSON.parse(storedUsers) as StoredUser[];
              if (Array.isArray(usersList) && usersList.some((u) => u.id === parsed.id && u.email === parsed.email)) {
                return parsed;
              }
            } catch { /* ignore */ }
          }
        }
      }
    } catch { /* ignore */ }
    return null;
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); } catch { /* ignore */ }
  }, [users]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      else localStorage.removeItem(SESSION_KEY);
    } catch { /* ignore */ }
  }, [user]);

  const login = useCallback((email: string, password: string) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return false;
    const { password: _p, ...safe } = found;
    setUser(safe);
    return true;
  }, [users]);

  const register = useCallback((name: string, email: string, password: string) => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return false;
    const newUser: StoredUser = {
      id: `user-${crypto.randomUUID()}`,
      name: name.trim() || 'Reader',
      email: email.trim(),
      password,
      role: 'user'
    };
    setUsers((prev) => [...prev, newUser]);
    const { password: _p, ...safe } = newUser;
    setUser(safe);
    return true;
  }, [users]);

  const logout = useCallback(() => setUser(null), []);

  const updateUserRole = useCallback((userId: string, role: 'admin' | 'user') => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    setUser((prev) => (prev && prev.id === userId ? { ...prev, role } : prev));
  }, []);

  const deleteUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setUser((prev) => (prev && prev.id === userId ? null : prev));
  }, []);

  const safeUsers = users.map(({ password: _p, ...rest }) => rest);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUserRole, deleteUser, isAdmin: user?.role === 'admin', users: safeUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};