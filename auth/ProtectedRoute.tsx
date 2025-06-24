"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../store/useAppStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAppStore((state) => state.token);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Wait until Zustand has hydrated the state from localStorage
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && token === null) {
      router.push('/');
    }
  }, [hydrated, token, router]);

  if (!hydrated) {
    // While hydrating, return loading UI or null
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return token ? children : null;
}
