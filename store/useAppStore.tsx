// stores/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AppState {
  user: any;
  token: string | null;
  userType: 'manager' | 'employee' | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any, isManager: boolean) => Promise<void>;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      userType: null,
      login: async (email, password) => {
        const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.detail || 'Login failed');
        }

        set({ 
          user: data.user, 
          token: data.access_token,
          userType: data.user_type 
        });
      },
      signup: async (userData, isManager) => {
        const endpoint = isManager 
          ? 'http://127.0.0.1:8000/api/auth/signup/manager' 
          : 'http://127.0.0.1:8000/api/auth/signup/employee';

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.detail || 'Signup failed');
          }

          set({ 
            user: data.user || data, 
            token: data.access_token || null,
            userType: isManager ? 'manager' : 'employee'
          });

          toast.success('Account created successfully! Please login to continue');

        } catch (error) {
          // Show error toast if needed
          toast.error('Signup failed', {
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
        set({ user: null, token: null });
      },
    }),
    {
      name: 'app-storage',
    }
  )
);