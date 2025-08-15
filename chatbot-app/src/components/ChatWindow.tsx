import React, { useState, useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { useChatMessages, useSendMessage } from '../hooks';

interface ChatWindowProps {
  chatId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, loading } = useChatMessages(chatId);
  const { sendMessage, loading: sendingMessage } = useSendMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || sendingMessage) return;

    const content = messageInput.trim();
    setMessageInput('');
    setIsTyping(true);

    try {
      await sendMessage(chatId, content);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore the message input on error
      setMessageInput(content);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-light-accent dark:border-dark-accent"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
          Chat #{chatId.slice(-8)}
        </h3>
        <p className="text-sm text-light-text/60 dark:text-dark-text/60">
          AI Assistant ready to help
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto chat-scrollbar p-4 bg-light-bg dark:bg-dark-bg">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-light-accent/10 dark:bg-dark-accent/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                Start a conversation
              </h4>
              <p className="text-light-text/60 dark:text-dark-text/60">
                Send a message to begin chatting with the AI assistant
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0 w-6 h-6 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">🤖</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-light-text/40 dark:bg-dark-text/40 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-light-text/40 dark:bg-dark-text/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-light-text/40 dark:bg-dark-text/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-text/40 dark:placeholder-dark-text/40 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
              disabled={sendingMessage}
            />
          </div>
          <button
            type="submit"
            disabled={!messageInput.trim() || sendingMessage}
            className="px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {sendingMessage ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
