import React, { useState } from 'react';
import { useChats, useCreateChat, useDeleteChat } from '../hooks';
import { Chat } from '../types';

interface ChatListProps {
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ selectedChatId, onSelectChat }) => {
  const { chats, loading } = useChats();
  const { createChat, loading: createLoading } = useCreateChat();
  const { deleteChat, loading: deleteLoading } = useDeleteChat();
  const [error, setError] = useState<string | null>(null);

  const handleCreateChat = async () => {
    setError(null);
    try {
      const newChat = await createChat();
      if (newChat?.id) {
        onSelectChat(newChat.id);
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
      setError('Failed to create new chat. Please try again.');
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteChat(chatId);
        if (selectedChatId === chatId) {
          onSelectChat('');
        }
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPreviewText = (chat: Chat) => {
    const lastMessage = chat.messages?.[0];
    if (!lastMessage) return 'New chat';
    
    const prefix = lastMessage.is_bot ? '🤖 ' : '👤 ';
    const content = lastMessage.content.length > 50 
      ? lastMessage.content.substring(0, 50) + '...'
      : lastMessage.content;
    
    return prefix + content;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-light-accent dark:border-dark-accent"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-light-border dark:border-dark-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
            Chats
          </h2>
          <button
            onClick={handleCreateChat}
            disabled={createLoading}
            className="p-2 text-light-accent dark:text-dark-accent hover:bg-light-border dark:hover:bg-dark-border rounded-md transition-colors disabled:opacity-50"
            title="New Chat"
          >
            {createLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-light-accent dark:border-dark-accent"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>
        {error && (
          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-light-text/60 dark:text-dark-text/60">
            <p>No chats yet.</p>
            <p className="text-sm mt-1">Create your first chat to get started!</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChatId === chat.id
                    ? 'bg-light-accent/10 dark:bg-dark-accent/10 border border-light-accent/20 dark:border-dark-accent/20'
                    : 'hover:bg-light-border dark:hover:bg-dark-border/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-light-text dark:text-dark-text truncate">
                        Chat #{chat.id.slice(-8)}
                      </p>
                      <p className="text-xs text-light-text/60 dark:text-dark-text/60 ml-2">
                        {formatDate(chat.updated_at)}
                      </p>
                    </div>
                    <p className="text-xs text-light-text/60 dark:text-dark-text/60 mt-1 truncate">
                      {getPreviewText(chat)}
                    </p>
                  </div>
                  
                  <button
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    disabled={deleteLoading}
                    className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-light-error dark:text-dark-error hover:bg-light-error/10 dark:hover:bg-dark-error/10 rounded transition-all disabled:opacity-50"
                    title="Delete Chat"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
