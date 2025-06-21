"use client"

import { ReactNode } from "react"
import SideBar from "../shared/sidebar"

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Sidebar - Takes up space based on its internal width */}
      <SideBar />

      {/* Main Content Area - Takes remaining space */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-6 h-full">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout