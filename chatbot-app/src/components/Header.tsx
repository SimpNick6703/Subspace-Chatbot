import React from 'react';
import { useSignOut, useUserData } from '@nhost/react';
import { useTheme } from '../hooks';

export const Header: React.FC = () => {
  const { signOut } = useSignOut();
  const user = useUserData();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-light-accent dark:bg-dark-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🤖</span>
          </div>
          <h1 className="text-xl font-semibold text-light-text dark:text-dark-text">
            ChatBot Assistant
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border rounded-md transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-light-text dark:text-dark-text">
                {user?.displayName || user?.email || 'User'}
              </p>
              <p className="text-xs text-light-text/60 dark:text-dark-text/60">
                {user?.email}
              </p>
            </div>
            
            <div className="w-8 h-8 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.displayName || user.email || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-medium text-sm">
                  {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                </span>
              )}
            </div>

            <button
              onClick={handleSignOut}
              className="p-2 text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border rounded-md transition-colors"
              title="Sign out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
