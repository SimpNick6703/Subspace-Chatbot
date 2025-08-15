import { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { useUserData } from '@nhost/react';
import {
  GET_CHATS,
  GET_CHAT_MESSAGES,
  CREATE_CHAT,
  CREATE_MESSAGE,
  DELETE_CHAT,
  SUBSCRIBE_TO_MESSAGES,
  SUBSCRIBE_TO_CHATS,
  SEND_MESSAGE_ACTION,
} from '../graphql/queries';
import { Chat, Message } from '../types';

export const useChats = () => {
  const { data, loading, error, refetch } = useQuery(GET_CHATS);
  const { data: subscriptionData } = useSubscription(SUBSCRIBE_TO_CHATS);

  return {
    chats: (subscriptionData?.chats || data?.chats || []) as Chat[],
    loading,
    error,
    refetch,
  };
};

export const useChatMessages = (chatId: string) => {
  const { data, loading, error } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chat_id: chatId },
    skip: !chatId,
  });
  
  const { data: subscriptionData } = useSubscription(SUBSCRIBE_TO_MESSAGES, {
    variables: { chat_id: chatId },
    skip: !chatId,
  });

  return {
    messages: (subscriptionData?.messages || data?.messages || []) as Message[],
    loading,
    error,
  };
};

export const useCreateChat = () => {
  const user = useUserData();
  const [createChatMutation, { loading }] = useMutation(CREATE_CHAT, {
    refetchQueries: [GET_CHATS],
  });

  const createChat = async () => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('Creating chat for user:', user.id);
      const result = await createChatMutation();
      console.log('Chat creation result:', result);
      return result.data?.insert_chats_one;
    } catch (error: any) {
      console.error('Error creating chat - Full error:', error);
      console.error('Error message:', error.message);
      console.error('GraphQL errors:', error.graphQLErrors);
      console.error('Network error:', error.networkError);
      throw error;
    }
  };

  return { createChat, loading };
};

export const useDeleteChat = () => {
  const [deleteChatMutation, { loading }] = useMutation(DELETE_CHAT, {
    refetchQueries: [GET_CHATS],
  });

  const deleteChat = async (chatId: string) => {
    try {
      await deleteChatMutation({
        variables: { chat_id: chatId },
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  };

  return { deleteChat, loading };
};

export const useSendMessage = () => {
  const user = useUserData();
  const [createMessageMutation] = useMutation(CREATE_MESSAGE);
  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (chatId: string, content: string) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      // First, save the user message (without user_id in object)
      console.log('Sending message - chatId:', chatId, 'content:', content);
      const messageResult = await createMessageMutation({
        variables: {
          object: {
            chat_id: chatId,
            content,
            is_bot: false,
          },
        },
      });
      console.log('Message creation result:', messageResult);

      // Then trigger the sendMessage action
      console.log('Calling sendMessage action');
      const result = await sendMessageAction({
        variables: {
          chat_id: chatId,
          message: content,
          session_variables: {
            x_hasura_user_id: user.id,
          },
        },
      });
      
      console.log('Action result:', result);

      return result.data?.sendMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};
