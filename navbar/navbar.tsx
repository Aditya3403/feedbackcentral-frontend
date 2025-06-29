"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from 'next/navigation'; 
import { useAppStore } from '../store/useAppStore';
import { useAppContext } from '../context/useAppContext';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  full_name: string;
  email: string;
  company: string;
  department: string;
  password: string;
}

const Navbar = () => {
  const router = useRouter();
  const { login, signup, logout, user, token } = useAppStore();
  const { showAuthModal, setShowAuthModal } = useAppContext();
  
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'manager' | 'employee'>('manager');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isAuthenticated = !!token;

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState<SignupData>({
    full_name: '',
    email: '',
    company: '',
    department: '',
    password: ''
  });

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
      await signup(signupData, userType === 'manager');
      setShowAuthModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (isLogin) {
      setLoginData(prev => ({ ...prev, [id]: value }));
    } else {
      setSignupData(prev => ({ ...prev, [id]: value }));
    }
  };

  const resetForm = () => {
    setError(null);
    setLoginData({ email: '', password: '' });
    setSignupData({ 
      full_name: '', 
      email: '', 
      company: '', 
      department: '', 
      password: '' 
    });
  };

  return (
    <>
      <nav className="bg-white w-full flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-40 flex items-center justify-center">
            <span className="text-black font-semibold text-lg">Feedback Central</span>
          </div>
        </div>
        
        <div>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="relative group">
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  aria-label="User menu"
                >
                  <span className="hidden sm:inline">Welcome, {user?.full_name}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <div className="py-1">
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowAuthModal(true);
                resetForm();
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              aria-label="Login"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div 
            className="absolute inset-0 bg-white/30 backdrop-blur-sm"
            onClick={() => setShowAuthModal(false)}
            aria-hidden="true"
          />
          
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 pb-0 flex-shrink-0">
              <h2 className="text-xl font-semibold text-center w-full">
                {isLogin ? 'Login' : `Sign Up as ${userType}`}
              </h2>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
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
                      type="button"
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
                      type="button"
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
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="your@email.com"
                            required
                            autoComplete="email"
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
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full max-w-xs">
                          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="full_name"
                            value={signupData.full_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder={userType === 'manager' ? 'Full Name' : 'Your Name'}
                            required
                            autoComplete="name"
                          />
                        </div>
                        <div className="w-full max-w-xs">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={signupData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="your@email.com"
                            required
                            autoComplete="email"
                          />
                        </div>
                        <div className="w-full max-w-xs">
                          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                            Company
                          </label>
                          <input
                            type="text"
                            id="company"
                            value={signupData.company}
                            onChange={handleInputChange}
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
                            value={signupData.department}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Department"
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
                            value={signupData.password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="••••••••"
                            required
                            autoComplete="new-password"
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
                      type="button"
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
                      type="button"
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