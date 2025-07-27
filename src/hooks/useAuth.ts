import { useState, useEffect } from 'react';
import { authAPI, getToken, setToken, removeToken } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  sacco?: {
    id: string;
    name: string;
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const token = getToken();
    if (token) {
      // In a real app, you'd verify the token with the backend
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(email, password);
      
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.firstName}!`,
      });
      
      return response;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    role: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(data);
      
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      
      toast({
        title: "Registration successful",
        description: `Welcome to NRTMS, ${response.user.firstName}!`,
      });
      
      return response;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
};