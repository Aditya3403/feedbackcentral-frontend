"use client"

import { useState } from "react";
import { AppContext } from "./AppContext";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <AppContext.Provider 
      value={{ 
        showAuthModal, 
        setShowAuthModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
}