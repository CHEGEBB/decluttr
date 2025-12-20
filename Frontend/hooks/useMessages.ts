/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useMessages.ts
// Custom hook for managing messages

import { useState, useEffect, useCallback } from 'react';
import messagesApi, { Conversation, MessageData } from '@/api/messages';

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagesApi.getConversations();
      setConversations(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for a specific conversation
  const fetchConversation = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagesApi.getConversation(userId);
      setMessages(data.messages || []);
      setActiveConversation(data.conversationId);
      
      // Mark as read
      if (data.conversationId) {
        await messagesApi.markAsRead(data.conversationId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch conversation');
      console.error('Error fetching conversation:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (
    receiverId: string,
    message: string,
    productId?: string
  ) => {
    try {
      setError(null);
      const data = await messagesApi.sendMessage({
        receiverId,
        message,
        productId,
      });
      
      // Add new message to current messages
      setMessages(prev => [...prev, data]);
      
      // Refresh conversations to update last message
      await fetchConversations();
      
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      console.error('Error sending message:', err);
      throw err;
    }
  }, [fetchConversations]);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    messages,
    activeConversation,
    loading,
    error,
    fetchConversations,
    fetchConversation,
    sendMessage,
    setMessages,
  };
};