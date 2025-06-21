"use client"

import { useState } from "react";
import { X } from "lucide-react";

const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'manager' | 'employee'>('manager');

  return (
    <>
      <nav className="w-full flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-32 bg-indigo-600 rounded flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Feedback Central</span>
          </div>
        </div>
        <div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Semi-transparent overlay with subtle blur */}
          <div 
            className="absolute inset-0 bg-white/30 backdrop-blur-sm"
            onClick={() => setShowAuthModal(false)}
          />
          
          {/* Centered rectangular modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 pb-0 flex-shrink-0">
              <h2 className="text-xl font-semibold text-center w-full">
                {isLogin ? 'Login' : 'Sign Up as:'}
              </h2>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className={`p-6 ${!isLogin ? 'overflow-y-auto' : ''}`}>
              {!isLogin && (
                <div className="mb-6 text-center">
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setUserType('manager')}
                      className={`py-2 px-4 rounded-md border ${
                        userType === 'manager'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      Manager
                    </button>
                    <button
                      onClick={() => setUserType('employee')}
                      className={`py-2 px-4 rounded-md border ${
                        userType === 'employee'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      Employee
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  {isLogin ? (
                    <>
                      <div className="w-full max-w-xs">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="w-full max-w-xs">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="••••••••"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {userType === 'manager' ? (
                        <>
                          <div className="w-full max-w-xs">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                              Username
                            </label>
                            <input
                              type="text"
                              id="username"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="username"
                            />
                          </div>
                          <div className="w-full max-w-xs">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="your@email.com"
                            />
                          </div>
                          <div className="w-full max-w-xs">
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                              Company
                            </label>
                            <input
                              type="text"
                              id="company"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Company Name"
                            />
                          </div>
                          <div className="w-full max-w-xs">
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                              Department
                            </label>
                            <input
                              type="text"
                              id="department"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Department"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full max-w-xs">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                              Full Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Your Name"
                            />
                          </div>
                          <div className="w-full max-w-xs">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="your@email.com"
                            />
                          </div>
                          <div className="w-full max-w-xs">
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                              Company
                            </label>
                            <input
                              type="text"
                              id="company"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Company Name"
                            />
                          </div>
                          <div className="w-full max-w-xs">
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                              Department
                            </label>
                            <input
                              type="text"
                              id="department"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Department"
                            />
                          </div>
                          <div className="w-full max-w-xs">
                            <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                              Manager Name
                            </label>
                            <input
                              type="text"
                              id="manager"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Your Manager's Name"
                            />
                          </div>
                        </>
                      )}
                      <div className="w-full max-w-xs">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="••••••••"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-full max-w-xs py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLogin ? 'Login' : 'Create Account'}
                  </button>
                </div>
              </div>

              <div className="mt-4 text-center text-sm text-gray-600">
                {isLogin ? (
                  <p>
                    New to Feedback Central?{' '}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-indigo-600 hover:underline"
                    >
                      Create account
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="text-indigo-600 hover:underline"
                    >
                      Log in
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;