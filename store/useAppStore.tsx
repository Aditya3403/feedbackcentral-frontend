import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: string;
  full_name: string;
  email: string;
  company?: string;
  department?: string;
  managers?: Array<{ manager_name: string }>;
  user_type?: 'manager' | 'employee';
}

interface AuthResponse {
  user: User;
  access_token: string;
  user_type: 'manager' | 'employee';
}

interface AppState {
  user: User | null;
  token: string | null;
  userType: 'manager' | 'employee' | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData, isManager: boolean) => Promise<void>;
  logout: () => void;
}

interface SignupData {
  full_name: string;
  email: string;
  company: string;
  department: string;
  password: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      userType: null,
      login: async (email, password) => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }

          const data: AuthResponse = await response.json();
          
          set({ 
            user: data.user, 
            token: data.access_token,
            userType: data.user_type 
          });

        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Login failed', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          throw error;
        }
      },
      signup: async (userData, isManager) => {
        const endpoint = isManager 
          ? `${BACKEND_URL}/api/auth/signup/manager` 
          : `${BACKEND_URL}/api/auth/signup/employee`;

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Signup failed');
          }

          const data: AuthResponse = await response.json();

          set({ 
            user: data.user, 
            token: data.access_token,
            userType: data.user_type
          });

          toast.success('Account created successfully! Please login to continue');

        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Signup failed', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          throw error;
        }
      },
      logout: () => {
        set({ 
          user: null, 
          token: null,
          userType: null 
        });
        toast.success('Logged out successfully');
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        userType: state.userType
      }),
    }
  )
);