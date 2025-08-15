export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface Chat {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user: User;
  messages: Message[];
}

export interface Message {
  id: string;
  chat_id: string;
  user_id: string;
  content: string;
  is_bot: boolean;
  created_at: string;
  updated_at: string;
  user: User;
  chat: Chat;
}

export interface CreateChatInput {
  user_id: string;
}

export interface CreateMessageInput {
  chat_id: string;
  user_id: string;
  content: string;
  is_bot: boolean;
}

export interface SendMessageActionInput {
  chat_id: string;
  message: string;
}

export interface SendMessageActionOutput {
  success: boolean;
  message?: string;
  error?: string;
}
