"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";
import {
  LOGIN_MUTATION,
  ADMIN_LOGIN_MUTATION,
  LOGOUT_MUTATION,
  ME_QUERY,
  IS_AUTHENTICATED_QUERY,
  type LoginInput,
  type AdminLoginInput,
  type User,
} from "@/lib/graphql/auth";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  adminLogin: (data: AdminLoginInput) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProviderContent({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await apolloClient.query({
        query: IS_AUTHENTICATED_QUERY,
        fetchPolicy: "network-only",
      });

      if (data.isAuthenticated) {
        const userResult = await apolloClient.query({
          query: ME_QUERY,
          fetchPolicy: "network-only",
        });
        setUser(userResult.data.me);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (loginInput: LoginInput) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { loginInput },
      });

      setUser(data.login.user);
      setIsAuthenticated(true);
      toast.success(data.login.message);
    } catch (error: any) {
      const message = error.graphQLErrors?.[0]?.message || "Login failed";
      toast.error(message);
      throw error;
    }
  }, []);

  const adminLogin = useCallback(async (adminLoginInput: AdminLoginInput) => {
    try {
      console.log("[AuthProvider] Admin login mutation started");
      const { data } = await apolloClient.mutate({
        mutation: ADMIN_LOGIN_MUTATION,
        variables: { adminLoginInput },
      });

      console.log("[AuthProvider] Admin login response:", data.adminLogin.user);
      console.log(
        "[AuthProvider] Setting user role:",
        data.adminLogin.user.role
      );
      setUser(data.adminLogin.user);
      setIsAuthenticated(true);
      toast.success(data.adminLogin.message);
    } catch (error: any) {
      const message = error.graphQLErrors?.[0]?.message || "Admin login failed";
      toast.error(message);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGOUT_MUTATION,
      });

      setUser(null);
      setIsAuthenticated(false);
      // Clear Apollo cache
      await apolloClient.clearStore();
      toast.success(data.logout.message);
    } catch (error: any) {
      const message = error.graphQLErrors?.[0]?.message || "Logout failed";
      toast.error(message);
      throw error;
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    adminLogin,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </ApolloProvider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
