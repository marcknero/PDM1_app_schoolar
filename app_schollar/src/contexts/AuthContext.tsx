import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthUser = {
  name: string;
  email: string;
};

type SignInPayload = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBootstrapping(false);
    }, 420);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async ({ email }: SignInPayload) => {
    setUser({
      name: 'Equipe Escolar',
      email: email.trim().toLowerCase(),
    });
  };

  const signOut = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      signIn,
      signOut,
    }),
    [isBootstrapping, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}