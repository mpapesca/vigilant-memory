import React, { createContext, useContext, type PropsWithChildren } from 'react';
import { useStorageState } from '../hooks/useStorageState';

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // Perform sign-in logic here
          setSession('authenticated');
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

// Legacy hook for backward compatibility
export function useAuth() {
  const { session, isLoading, signIn, signOut } = useSession();
  
  return {
    isAuthenticated: !!session,
    isLoading,
    login: signIn,
    logout: signOut,
  };
}

// Legacy provider alias
export const AuthProvider = SessionProvider;
