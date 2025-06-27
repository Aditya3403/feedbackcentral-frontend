"use client"

import { Home, NotebookPen, ChevronLeft, User, Settings, ChevronDown, ChevronUp, LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAppStore } from '../store/useAppStore';

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 72;

const SideBar = () => {
  const { login, signup, logout, user } = useAppStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [feedbackExpanded, setFeedbackExpanded] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const getUserInitials = (fullName: string) => {
    const names = fullName.split(' ');
    let initials = names[0].charAt(0).toUpperCase();
    
    if (names.length > 1) {
      initials += names[names.length - 1].charAt(0).toUpperCase();
    }
    
    return initials;
  };

  const navItems = [
    {
      label: "Home",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Feedback",
      icon: <NotebookPen className="w-5 h-5" />,
      subItems: [
        {
          label: "Feedback Given",
          path: "/dashboard/feedback/feedback-given",
        },
        {
          label: "Feedback Received",
          path: "/dashboard/feedback/feedback-recieved",
        },
      ],
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const toggleFeedback = () => {
    setFeedbackExpanded(!feedbackExpanded);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    console.log('User logged out');
    logout()
  };

  return (
    <div
      className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 transition-all duration-300"
      style={{
        width: sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
      }}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="p-4 flex-1 overflow-y-auto">
          <div
            className={`mb-6 flex items-center ${
              sidebarCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!sidebarCollapsed && (
              <span className="text-xl font-bold text-gray-900 dark:text-white">FeedBack Central</span>
            )}
            
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Expand sidebar"
              >
                <span className="text-xl font-bold text-gray-900 dark:text-white">FC</span>
              </button>
            )}
            
            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>

          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.path ? (
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all no-underline ${
                      sidebarCollapsed ? "justify-center px-0" : ""
                    } text-black dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                    style={{ textDecoration: 'none' }}
                  >
                    <span className={`flex items-center justify-center ${sidebarCollapsed ? "w-10" : ""}`}>
                      {item.icon}
                    </span>
                    {!sidebarCollapsed && (
                      <span className="text-lg">{item.label}</span>
                    )}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={toggleFeedback}
                      className={`flex items-center justify-between w-full px-3 py-3 rounded-lg transition-all ${
                        sidebarCollapsed ? "justify-center px-0" : ""
                      } text-black dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center justify-center ${sidebarCollapsed ? "w-10" : ""}`}>
                          {item.icon}
                        </span>
                        {!sidebarCollapsed && (
                          <span className="text-lg">{item.label}</span>
                        )}
                      </div>
                      {!sidebarCollapsed && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${feedbackExpanded ? 'rotate-180' : ''}`}
                        />
                      )}
                    </button>
                    {!sidebarCollapsed && feedbackExpanded && (
                      <div className="pl-12 space-y-1">
                        {item.subItems?.map((subItem) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-black dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 no-underline"
                          >
                            <span className="text-sm">{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 relative">
          {!sidebarCollapsed ? (
            <>
              <button
                onClick={toggleUserMenu}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    {user?.full_name ? (
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {getUserInitials(user.full_name)}
                      </span>
                    ) : (
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <ChevronUp className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 mx-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        {user?.full_name ? (
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {getUserInitials(user.full_name)}
                          </span>
                        ) : (
                          <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 flex justify-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                {getUserInitials(user.full_name)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;