/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Search,
  Send,
  Shield,
  Star,
  Clock,
  CheckCheck,
  Smile,
  Paperclip,
  X,
  ImageIcon,
  File,
  MapPin,
  Loader2
} from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';

// Quick replies
const quickReplies = [
  'Is this still available?',
  'Can you share more photos?',
  'What\'s your best price?',
  'Can I see it in person?',
  'When can you deliver?'
];

export default function MessagesPage() {
  const {
    conversations,
    messages,
    loading,
    error,
    fetchConversation,
    sendMessage
  } = useMessages();

  const [activeChat, setActiveChat] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchConversations, setSearchConversations] = useState('');
  const [filteredConversations, setFilteredConversations] = useState(conversations);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter conversations based on search
  useEffect(() => {
    if (!searchConversations) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conv =>
        conv.user.username.toLowerCase().includes(searchConversations.toLowerCase()) ||
        conv.user.name.toLowerCase().includes(searchConversations.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchConversations.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchConversations, conversations]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load first conversation on mount
  useEffect(() => {
    if (conversations.length > 0 && !activeChat) {
      const firstConv = conversations[0];
      setActiveChat(firstConv);
      fetchConversation(firstConv.user._id);
    }
  }, [conversations, activeChat, fetchConversation]);

  // Handle conversation click
  const handleConversationClick = async (conversation: any) => {
    setActiveChat(conversation);
    await fetchConversation(conversation.user._id);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat || sending) return;

    try {
      setSending(true);
      await sendMessage(activeChat.user._id, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Handle quick reply
  const handleQuickReply = (reply: string) => {
    setNewMessage(reply);
  };

  // Handle enter key to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  };

  const currentUserId = getCurrentUserId();

  if (loading && conversations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Messages</h1>
              <p className="text-gray-600">Chat with sellers and buyers securely</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchConversations}
              onChange={(e) => setSearchConversations(e.target.value)}
              placeholder="Search conversations..."
              className="pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors w-full md:w-64"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Main Chat Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row h-[calc(100vh-240px)] min-h-[600px]">
            {/* Left Column - Conversations List */}
            <div className="lg:w-1/3 border-r border-gray-200 flex flex-col">
              {/* Conversations Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-gray-900">Conversations</h2>
                  <span className="text-sm text-gray-500">{filteredConversations.length} chats</span>
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchConversations ? 'No conversations found' : 'No messages yet'}
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.conversationId}
                      onClick={() => handleConversationClick(conversation)}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        activeChat?.conversationId === conversation.conversationId 
                          ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                          : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* User Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                          {conversation.user.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Conversation Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-gray-900 truncate">
                              {conversation.user.name}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(conversation.lastMessageTime)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage}
                          </p>
                          
                          <div className="text-xs text-gray-500 mt-1">
                            @{conversation.user.username}
                          </div>
                        </div>

                        {/* Unread Badge */}
                        {conversation.unreadCount > 0 && (
                          <div className="flex-shrink-0">
                            <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column - Chat Messages */}
            <div className="lg:w-2/3 flex flex-col">
              {!activeChat ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a conversation to start messaging</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                        {activeChat.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{activeChat.user.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Shield className="w-3 h-3" />
                          @{activeChat.user.username}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages Container */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white to-gray-50">
                    {loading && messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isOwn = message.sender._id === currentUserId;
                          
                          return (
                            <div
                              key={message._id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[70%] ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
                                {/* Sender Name for received messages */}
                                {!isOwn && (
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold text-gray-700">
                                      {message.sender.name}
                                    </span>
                                  </div>
                                )}

                                {/* Message Bubble */}
                                <div
                                  className={`rounded-2xl p-3 ${
                                    isOwn
                                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none'
                                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm'
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap">{message.message}</p>
                                  
                                  {/* Product Reference */}
                                  {message.product && (
                                    <div className="mt-2 pt-2 border-t border-white/20">
                                      <div className="flex items-center gap-2 text-xs opacity-90">
                                        <Star className="w-3 h-3" />
                                        <span>{message.product.name}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Message Meta */}
                                <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(message.createdAt)}
                                  </span>
                                  
                                  {isOwn && (
                                    <span className="text-xs">
                                      {message.isRead ? (
                                        <CheckCheck className="w-3 h-3 text-blue-600" />
                                      ) : (
                                        <Clock className="w-3 h-3 text-gray-400" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Quick Replies */}
                  <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-full whitespace-nowrap hover:border-blue-500 hover:text-blue-600 transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-end gap-2">
                      {/* Message Input */}
                      <div className="flex-1 relative">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message here..."
                          disabled={sending}
                          className="w-full pl-4 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none min-h-[44px] max-h-[120px] disabled:opacity-50"
                          rows={1}
                        />
                        <div className="absolute right-2 bottom-2">
                          <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg">
                            <Smile className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Send Button */}
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        className={`p-3 rounded-xl transition-all ${
                          newMessage.trim() && !sending
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {sending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-3 text-center">
                      <div className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Shield className="w-3 h-3" />
                        <span>Your messages are protected</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}