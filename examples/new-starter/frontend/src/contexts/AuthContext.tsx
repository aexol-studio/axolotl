import { createContext, useContext } from 'react';

interface InitialAuthState {
  isAuthenticated: boolean;
}

const AuthContext = createContext<InitialAuthState>({ isAuthenticated: false });

export const AuthProvider = ({ children, value }: { children: React.ReactNode; value: InitialAuthState }) => (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
);

export const useInitialAuth = () => useContext(AuthContext);
