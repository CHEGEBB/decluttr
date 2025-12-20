// lib/api/messages.ts
// Messaging-related API calls

import apiClient from './client';

export interface User {
  _id: string;
  name: string;
  username: string;
}

export interface MessageData {
  _id: string;
  conversationId: string;
  sender: User;
  receiver: User;
  message: string;
  product?: {
    _id: string;
    name: string;
    images: Array<{ url: string }>;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  conversationId: string;
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface ConversationDetails {
  conversationId: string;
  otherUser: User;
  messages: MessageData[];
}

export const messagesApi = {
  // Get all conversations
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<Conversation[]>('/messages/conversations');
    return response.data || [];
  },

  // Get messages with specific user
  async getConversation(userId: string): Promise<ConversationDetails> {
    const response = await apiClient.get<ConversationDetails>(`/messages/conversation/${userId}`);
    if (!response.data) {
      throw new Error('No conversation data received');
    }
    return response.data;
  },

  // Send a message
  async sendMessage(data: {
    receiverId: string;
    message: string;
    productId?: string;
  }): Promise<MessageData> {
    const response = await apiClient.post<MessageData>('/messages/send', data);
    if (!response.data) {
      throw new Error('No message data received');
    }
    return response.data;
  },

  // Mark conversation as read
  async markAsRead(conversationId: string): Promise<void> {
    await apiClient.put(`/messages/${conversationId}/read`);
  },
};

export default messagesApi;