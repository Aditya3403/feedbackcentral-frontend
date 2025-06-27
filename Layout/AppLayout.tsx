"use client"

import { ReactNode } from "react"
import SideBar from "../shared/sidebar"

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <SideBar />

      <div className="flex-1 overflow-y-auto">
        <main className="p-6 h-full">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout