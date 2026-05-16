'use client';

import { IAuthContext, IUser } from '@/types';
import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext<IAuthContext | null>(null);

const AuthProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: IUser | null;
}) => {
  const [user, setUser] = useState(initialUser);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return ctx;
};
