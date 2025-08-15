import { gql } from '@apollo/client';

// Queries
export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { updated_at: desc }) {
      id
      user_id
      created_at
      updated_at
      messages(order_by: { created_at: desc }, limit: 1) {
        id
        content
        is_bot
        created_at
      }
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chat_id: uuid!) {
    messages(
      where: { chat_id: { _eq: $chat_id } }
      order_by: { created_at: asc }
    ) {
      id
      chat_id
      user_id
      content
      is_bot
      created_at
      updated_at
    }
  }
`;

export const GET_CHAT_WITH_MESSAGES = gql`
  query GetChatWithMessages($chat_id: uuid!) {
    chats_by_pk(id: $chat_id) {
      id
      user_id
      created_at
      updated_at
      messages(order_by: { created_at: asc }) {
        id
        chat_id
        user_id
        content
        is_bot
        created_at
        updated_at
      }
    }
  }
`;

// Mutations
export const CREATE_CHAT = gql`
  mutation CreateChat {
    insert_chats_one(object: {}) {
      id
      user_id
      created_at
      updated_at
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($object: messages_insert_input!) {
    insert_messages_one(object: $object) {
      id
      chat_id
      user_id
      content
      is_bot
      created_at
      updated_at
    }
  }
`;

export const DELETE_CHAT = gql`
  mutation DeleteChat($chat_id: uuid!) {
    delete_chats_by_pk(id: $chat_id) {
      id
    }
  }
`;

// Subscriptions
export const SUBSCRIBE_TO_MESSAGES = gql`
  subscription SubscribeToMessages($chat_id: uuid!) {
    messages(
      where: { chat_id: { _eq: $chat_id } }
      order_by: { created_at: asc }
    ) {
      id
      chat_id
      user_id
      content
      is_bot
      created_at
      updated_at
    }
  }
`;

export const SUBSCRIBE_TO_CHATS = gql`
  subscription SubscribeToChats {
    chats(order_by: { updated_at: desc }) {
      id
      user_id
      created_at
      updated_at
      messages(order_by: { created_at: desc }, limit: 1) {
        id
        content
        is_bot
        created_at
      }
    }
  }
`;

// Actions - sendMessage action to trigger n8n workflow
export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($chat_id: ID!, $message: String!, $session_variables: SessionVariablesInput!) {
    sendMessage(chat_id: $chat_id, message: $message, session_variables: $session_variables) {
      success
      message
      error
    }
  }
`;
