import { useState, useEffect } from 'react';
import { useAuthenticationStatus } from '@nhost/react';
import { Auth } from './components/Auth';
import { Header } from './components/Header';
import { ChatList } from './components/ChatList';
import { ChatWindow } from './components/ChatWindow';

function App() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize theme
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-accent dark:border-dark-accent mx-auto mb-4"></div>
          <p className="text-light-text dark:text-dark-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="h-screen bg-light-bg dark:bg-dark-bg flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-20 left-4 z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-md shadow-lg"
          >
            <svg className="w-5 h-5 text-light-text dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Chat List Sidebar */}
        <div className={`
          w-80 bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border
          lg:relative lg:translate-x-0 lg:opacity-100
          ${isMobileMenuOpen 
            ? 'fixed left-0 top-16 h-[calc(100vh-4rem)] z-50 translate-x-0 opacity-100' 
            : 'fixed left-0 top-16 h-[calc(100vh-4rem)] z-50 -translate-x-full opacity-0 lg:opacity-100'
          }
          transition-all duration-300 ease-in-out
        `}>
          <ChatList 
            selectedChatId={selectedChatId} 
            onSelectChat={(chatId) => {
              setSelectedChatId(chatId);
              setIsMobileMenuOpen(false);
            }} 
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedChatId ? (
            <ChatWindow chatId={selectedChatId} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-light-bg dark:bg-dark-bg">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto mb-6 bg-light-accent/10 dark:bg-dark-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-4xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                  Welcome to ChatBot Assistant
                </h3>
                <p className="text-light-text/60 dark:text-dark-text/60 mb-6">
                  Select a chat from the sidebar or create a new one to start a conversation with our AI assistant.
                </p>
                <div className="space-y-2 text-sm text-light-text/60 dark:text-dark-text/60">
                  <p>🚀 Powered by OpenRouter AI</p>
                  <p>🔒 Secure with Nhost Authentication</p>
                  <p>⚡ Real-time with GraphQL Subscriptions</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
