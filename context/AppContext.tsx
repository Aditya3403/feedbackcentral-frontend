"use client"

import { createContext } from "react";

interface AppContextType {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);