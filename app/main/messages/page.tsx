/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  Clock,
  User,
  ShoppingBag,
  Image as ImageIcon,
  File,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Filter,
  Archive,
  Trash2,
  Star,
  Mic,
  X
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/footer';
import { InfiniteMarquee } from '@/components/marketplace/InfiniteMarquee';

// Mock conversations data
const mockConversations = [
  {
    id: '1',
    userId: 'tech_trader',
    userName: 'Tech Trader',
    userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    lastMessage: 'The iPhone is still available. Would you like to schedule a viewing?',
    timestamp: '10:30 AM',
    unreadCount: 3,
    isOnline: true,
    product: 'iPhone 12 Pro 256GB',
    productPrice: 'KSh 85,000',
    productImage: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=100&h=100&fit=crop'
  },
  {
    id: '2',
    userId: 'sneaker_head',
    userName: 'Sneaker Head',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    lastMessage: 'Yes, the shoes are brand new in box. Size 9.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    product: 'Nike Air Max 270 React',
    productPrice: 'KSh 13,500',
    productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
  },
  {
    id: '3',
    userId: 'home_declutter',
    userName: 'Home Declutter',
    userImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
    lastMessage: 'The desk can be delivered tomorrow between 2-4 PM.',
    timestamp: '2 days ago',
    unreadCount: 1,
    isOnline: true,
    product: 'Modern Wooden Study Desk',
    productPrice: 'KSh 28,000',
    productImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=100&h=100&fit=crop'
  },
  {
    id: '4',
    userId: 'bookworm_ken',
    userName: 'Bookworm Ken',
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    lastMessage: 'All 7 books are in excellent condition. No highlights.',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: false,
    product: 'Harry Potter Complete Book Set',
    productPrice: 'Free',
    productImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=100&fit=crop'
  },
  {
    id: '5',
    userId: 'fashionista_jane',
    userName: 'Fashionista Jane',
    userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    lastMessage: 'The jacket is genuine leather, worn only twice.',
    timestamp: '1 week ago',
    unreadCount: 0,
    isOnline: true,
    product: 'Vintage Leather Jacket',
    productPrice: 'KSh 12,500',
    productImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop'
  }
];

// Mock messages for active conversation
const mockMessages = [
  {
    id: '1',
    senderId: 'tech_trader',
    senderName: 'Tech Trader',
    text: 'Hello! I saw you\'re interested in the iPhone 12 Pro?',
    timestamp: '10:15 AM',
    isOwn: false
  },
  {
    id: '2',
    senderId: 'current_user',
    senderName: 'You',
    text: 'Yes, I am! Is it still available?',
    timestamp: '10:18 AM',
    isOwn: true,
    status: 'read'
  },
  {
    id: '3',
    senderId: 'tech_trader',
    senderName: 'Tech Trader',
    text: 'Yes, it\'s still available. The phone is in like-new condition with original box and accessories.',
    timestamp: '10:20 AM',
    isOwn: false
  },
  {
    id: '4',
    senderId: 'current_user',
    senderName: 'You',
    text: 'Can you share more photos of the actual condition?',
    timestamp: '10:22 AM',
    isOwn: true,
    status: 'read'
  },
  {
    id: '5',
    senderId: 'tech_trader',
    senderName: 'Tech Trader',
    text: 'Sure! Here are some additional photos:',
    timestamp: '10:25 AM',
    isOwn: false
  },
  {
    id: '6',
    senderId: 'tech_trader',
    senderName: 'Tech Trader',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop',
    timestamp: '10:25 AM',
    isOwn: false
  },
  {
    id: '7',
    senderId: 'tech_trader',
    senderName: 'Tech Trader',
    text: 'The iPhone is still available. Would you like to schedule a viewing or discuss the price further?',
    timestamp: '10:30 AM',
    isOwn: false
  }
];

// Quick replies
const quickReplies = [
  'Is this still available?',
  'Can you share more photos?',
  'What\'s your best price?',
  'Can I see it in person?',
  'When can you deliver?'
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(mockConversations[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchConversations, setSearchConversations] = useState('');
  const [filteredConversations, setFilteredConversations] = useState(mockConversations);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle search for Navbar
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter conversations based on search
  useEffect(() => {
    if (!searchConversations) {
      setFilteredConversations(mockConversations);
    } else {
      const filtered = mockConversations.filter(conv =>
        conv.userName.toLowerCase().includes(searchConversations.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchConversations.toLowerCase()) ||
        conv.product.toLowerCase().includes(searchConversations.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchConversations]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: `${Date.now()}`,
      senderId: 'current_user',
      senderName: 'You',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      status: 'sent'
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate reply after 1 second
    setTimeout(() => {
      const replies = [
        'Thanks for your message!',
        'I\'ll get back to you shortly.',
        'That sounds good to me.',
        'Let me check and get back to you.'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const replyMsg = {
        id: `${Date.now() + 1}`,
        senderId: activeChat.userId,
        senderName: activeChat.userName,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false
      };
      
      setMessages(prev => [...prev, replyMsg]);
    }, 1000);
  };

  // Handle quick reply
  const handleQuickReply = (reply: string) => {
    setNewMessage(reply);
  };

  // Handle attachment
  const handleAttachment = (type: string) => {
    const attachments = {
      image: {
        id: `${Date.now()}`,
        senderId: 'current_user',
        senderName: 'You',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        status: 'sent'
      },
      file: {
        id: `${Date.now()}`,
        senderId: 'current_user',
        senderName: 'You',
        type: 'file',
        content: 'receipt.pdf',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        status: 'sent'
      },
      location: {
        id: `${Date.now()}`,
        senderId: 'current_user',
        senderName: 'You',
        type: 'location',
        content: 'Nairobi CBD',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        status: 'sent'
      }
    };

    const attachment = attachments[type as keyof typeof attachments];
    setMessages(prevMessages => [...prevMessages, attachment as any]);
    setShowAttachments(false);
  };

  // Handle enter key to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (time: string) => {
    return time;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
              <InfiniteMarquee />

      <Navbar cartCount={3} onSearch={handleSearch} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Messages</h1>
              <p className="text-gray-600">Chat with sellers and buyers securely</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchConversations}
                onChange={(e) => setSearchConversations(e.target.value)}
                placeholder="Search conversations..."
                className="pl-10 pr-4 py-2.5 bg-white text-gray-500 placeholder:text-gray-500 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors w-full md:w-64"
              />
            </div>
            <button className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="bg-white shadow-xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row h-[calc(100vh-240px)] min-h-[600px]">
            {/* Left Column - Conversations List */}
            <div className="lg:w-1/3 border-r border-gray-200 flex flex-col">
              {/* Conversations Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-gray-900">Conversations</h2>
                  <span className="text-sm text-gray-500">{filteredConversations.length} chats</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex-1 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    All
                  </button>
                  <button className="flex-1 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Unread
                  </button>
                  <button className="flex-1 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Archived
                  </button>
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setActiveChat(conversation)}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        activeChat.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* User Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                            <img
                              src={conversation.userImage}
                              alt={conversation.userName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {conversation.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>

                        {/* Conversation Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-gray-900 truncate">{conversation.userName}</h3>
                            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                          </div>
                          
                          <p className="text-sm text-gray-600 truncate mb-2">
                            {conversation.lastMessage}
                          </p>
                          
                          {/* Product Preview */}
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded overflow-hidden">
                              <img
                                src={conversation.productImage}
                                alt={conversation.product}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-xs text-gray-700 font-medium truncate">
                              {conversation.product}
                            </div>
                            <div className="text-xs font-bold text-blue-600 ml-auto">
                              {conversation.productPrice}
                            </div>
                          </div>
                        </div>

                        {/* Unread Badge */}
                        {conversation.unreadCount > 0 && (
                          <div className="flex-shrink-0">
                            <span className="w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
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
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                      <img
                        src={activeChat.userImage}
                        alt={activeChat.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {activeChat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{activeChat.userName}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified Seller
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        4.8 Rating
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Product Info */}
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 rounded overflow-hidden">
                      <img
                        src={activeChat.productImage}
                        alt={activeChat.product}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">{activeChat.product}</div>
                      <div className="text-xs text-blue-600 font-bold">{activeChat.productPrice}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Info className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white to-gray-50">
                {/* Date Separator */}
                <div className="text-center mb-6">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                    Today
                  </span>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.isOwn ? 'ml-auto' : 'mr-auto'}`}>
                        {/* Sender Name for received messages */}
                        {!message.isOwn && (
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                              <img
                                src={activeChat.userImage}
                                alt={message.senderName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{message.senderName}</span>
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`rounded-2xl p-3 ${
                            message.isOwn
                              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-br-none'
                              : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm'
                          }`}
                        >
                          {/* Text Message */}
                          {message.type === undefined && (
                            <p className="whitespace-pre-wrap">{message.text}</p>
                          )}

                          {/* Image Message */}
                          {message.type === 'image' && (
                            <div className="space-y-2">
                              <div className="rounded-lg overflow-hidden">
                                <img
                                  src={message.content}
                                  alt="Shared image"
                                  className="w-full h-auto max-h-64 object-cover"
                                />
                              </div>
                              <p className="text-sm opacity-90">📷 Photo shared</p>
                            </div>
                          )}

                          {/* File Message */}
                          {message.type === 'file' && (
                            <div className="flex items-center gap-3 p-2 bg-white/20 rounded-lg">
                              <File className="w-8 h-8" />
                              <div>
                                <div className="font-semibold">{message.content}</div>
                                <div className="text-xs opacity-80">PDF Document • 2.4 MB</div>
                              </div>
                            </div>
                          )}

                          {/* Location Message */}
                          {message.type === 'location' && (
                            <div className="flex items-center gap-3 p-2 bg-white/20 rounded-lg">
                              <MapPin className="w-8 h-8" />
                              <div>
                                <div className="font-semibold">Location Shared</div>
                                <div className="text-xs opacity-80">{message.content}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Message Meta */}
                        <div className={`flex items-center gap-2 mt-1 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                          
                          {message.isOwn && (
                            <span className="text-xs">
                              {message.status === 'sent' && <Check className="w-3 h-3 text-gray-400" />}
                              {message.status === 'delivered' && <CheckCheck className="w-3 h-3 text-gray-400" />}
                              {message.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-600" />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
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
                {/* Attachment Menu */}
                {showAttachments && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200 animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Attach File</span>
                      <button
                        onClick={() => setShowAttachments(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => handleAttachment('image')}
                        className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <ImageIcon className="w-6 h-6 text-gray-600 mb-1" />
                        <span className="text-xs text-gray-600">Photo</span>
                      </button>
                      <button
                        onClick={() => handleAttachment('file')}
                        className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <File className="w-6 h-6 text-gray-600 mb-1" />
                        <span className="text-xs text-gray-600">Document</span>
                      </button>
                      <button
                        onClick={() => handleAttachment('location')}
                        className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <MapPin className="w-6 h-6 text-gray-600 mb-1" />
                        <span className="text-xs text-gray-600">Location</span>
                      </button>
                      <button className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <Calendar className="w-6 h-6 text-gray-600 mb-1" />
                        <span className="text-xs text-gray-600">Schedule</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-end gap-2">
                  {/* Attachment Button */}
                  <button
                    onClick={() => setShowAttachments(!showAttachments)}
                    className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  {/* Message Input */}
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      className="w-full pl-4 pr-12 py-3 text-gray-500 placeholder:text-gray-500 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none min-h-[44px] max-h-[120px]"
                      rows={1}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                      <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg">
                        <Smile className="w-5 h-5" />
                      </button>
                      <button
                        onMouseDown={() => setIsRecording(true)}
                        onMouseUp={() => setIsRecording(false)}
                        onMouseLeave={() => setIsRecording(false)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isRecording 
                            ? 'bg-red-100 text-red-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`p-3 rounded-xl transition-all ${
                      newMessage.trim()
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-400 hover:to-red-400 hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {/* Security Notice */}
                <div className="mt-3 text-center">
                  <div className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Shield className="w-3 h-3" />
                    <span>Your messages are protected with end-to-end encryption</span>
                    <span className="text-blue-600 font-semibold">•</span>
                    <Bell className="w-3 h-3" />
                    <span>Enable notifications for instant replies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

       

     
      </div>
      <Footer />

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
}