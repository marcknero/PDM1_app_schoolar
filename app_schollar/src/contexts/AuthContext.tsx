import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';

import { signIn as requestSignIn, setSessionToken } from '../services/schoolService';

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
  const [isBootstrapping] = useState(false);

  const signIn = async ({ email, password }: SignInPayload) => {
    const response = await requestSignIn({
      email: email.trim().toLowerCase(),
      password,
    });

    setSessionToken(response.token);
    setUser({
      name: response.usuario.nome,
      email: response.usuario.email,
    });
  };

  const signOut = () => {
    setSessionToken(null);
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