import React, { useState } from 'react';
import { AlertCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from './auth/AuthModal';
import { CrisisReportModal } from './CrisisReportModal';

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const openSignIn = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800 shadow-lg">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex w-full items-center justify-between py-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-purple-200" />
              <span className="ml-2 text-2xl font-bold text-white">CrisisConnect</span>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex flex-nowrap items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-200" />
                    <span className="text-white">{user.name}</span>
                  </div>
                  <div className="flex flex-nowrap items-center gap-2 sm:gap-4">
                    <button
                      onClick={handleSignOut}
                      className="rounded-md bg-white/10 backdrop-blur-sm px-3.5 py-2.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-200 whitespace-nowrap"
                    >
                      Sign out
                    </button>
                    <button
                      onClick={() => setIsReportModalOpen(true)}
                      className="rounded-md z-30 bg-purple-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-400 transition-all duration-200 whitespace-nowrap"
                    >
                      Report Crisis
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-nowrap items-center gap-2 sm:gap-4">
                  <button
                    data-action="signin"
                    onClick={openSignIn}
                    className="rounded-md z-20 bg-white/10 backdrop-blur-sm px-3.5 py-2.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-200 whitespace-nowrap"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={openSignUp}
                    className="rounded-md z-20 bg-purple-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-400 transition-all duration-200 whitespace-nowrap"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authMode} />
      <CrisisReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </>
  );
}
