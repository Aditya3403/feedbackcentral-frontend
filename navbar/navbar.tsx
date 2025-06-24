"use client"

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from 'next/navigation'; 
import { useAppStore } from '../store/useAppStore';

interface LoginData {
  email: string;
  password: string;
}

interface ManagerSignupData {
  full_name: string; 
  email: string;
  company: string;
  department: string;
  password: string;
}

interface EmployeeSignupData {
  full_name: string;
  email: string;
  company: string;
  department: string;
  password: string;
}

const Navbar = () => {
  const router = useRouter();
  const { login, signup, logout, user } = useAppStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'manager' | 'employee'>('manager');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });

  const [managerSignupData, setManagerSignupData] = useState<ManagerSignupData>({
    full_name: '',
    email: '',
    company: '',
    department: '',
    password: ''
  });

  const [employeeSignupData, setEmployeeSignupData] = useState<EmployeeSignupData>({
    full_name: '',
    email: '',
    company: '',
    department: '',
    password: ''
  });

// Updated handleLogin function
 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(loginData.email, loginData.password);
      setShowAuthModal(false);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = userType === 'manager' ? managerSignupData : employeeSignupData;
      await signup(userData, userType === 'manager');
      setShowAuthModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData(prev => ({ ...prev, [id]: value }));
  };

  const handleManagerSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setManagerSignupData(prev => ({ ...prev, [id]: value }));
  };

  const handleEmployeeSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEmployeeSignupData(prev => ({ ...prev, [id]: value }));
  };

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
          <div 
            className="absolute inset-0 bg-white/30 backdrop-blur-sm"
            onClick={() => setShowAuthModal(false)}
          />
          
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
              {error && (
                <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}

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

              <form onSubmit={isLogin ? handleLogin : handleSignup}>
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
                            value={loginData.email}
                            onChange={handleLoginInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                        <div className="w-full max-w-xs">
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                            Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            value={loginData.password}
                            onChange={handleLoginInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {userType === 'manager' ? (
                          <>
                            <div className="w-full max-w-xs">
                              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                                Full Name
                              </label>
                              <input
                                type="text"
                                id="full_name"
                                value={managerSignupData.full_name}
                                onChange={handleManagerSignupInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Full Name"
                                required
                              />
                            </div>
                            <div className="w-full max-w-xs">
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                                Email
                              </label>
                              <input
                                type="email"
                                id="email"
                                value={managerSignupData.email}
                                onChange={handleManagerSignupInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="your@email.com"
                                required
                              />
                            </div>
                            <div className="w-full max-w-xs">
                              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                                Company
                              </label>
                              <input
                                type="text"
                                id="company"
                                value={managerSignupData.company}
                                onChange={handleManagerSignupInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Company Name"
                                required
                              />
                            </div>
                            <div className="w-full max-w-xs">
                              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                                Department
                              </label>
                              <input
                                type="text"
                                id="department"
                                value={managerSignupData.department}
                                onChange={handleManagerSignupInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Department"
                                required
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full max-w-xs">
                              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                                Full Name
                              </label>
                              <input
                                type="text"
                                id="full_name"
                                value={employeeSignupData.full_name}
                                onChange={handleEmployeeSignupInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Your Name"
                                required
                              />
                            </div>
                            <div className="w-full max-w-xs">
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                                Email
                              </label>
                              <input
                                type="email"
                                id="email"
                                value={employeeSignupData.email}
                                onChange={handleEmployeeSignupInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="your@email.com"
                                required
                              />
                            </div>
                            <div className="w-full max-w-xs">
                              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                                Company
                              </label>
                              <input
                                type="text"
                                id="company"
                                value={employeeSignupData.company}
                                onChange={handleEmployeeSignupInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Company Name"
                                required
                              />
                            </div>
                            <div className="w-full max-w-xs">
                              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                                Department
                              </label>
                              <input
                                type="text"
                                id="department"
                                value={employeeSignupData.department}
                                onChange={handleEmployeeSignupInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Department"
                                required
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
                            value={userType === 'manager' ? managerSignupData.password : employeeSignupData.password}
                            onChange={userType === 'manager' ? handleManagerSignupInputChange : handleEmployeeSignupInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full max-w-xs py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="inline-flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {isLogin ? 'Logging in...' : 'Creating account...'}
                        </span>
                      ) : (
                        isLogin ? 'Login' : 'Create Account'
                      )}
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-4 text-center text-sm text-gray-600">
                {isLogin ? (
                  <p>
                    New to Feedback Central?{' '}
                    <button
                      onClick={() => {
                        setIsLogin(false);
                        setError(null);
                      }}
                      className="text-indigo-600 hover:underline"
                    >
                      Create account
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      onClick={() => {
                        setIsLogin(true);
                        setError(null);
                      }}
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