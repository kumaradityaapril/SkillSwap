import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import io from 'socket.io-client';

// Create a context for chat management
const ChatContext = createContext();

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Chat provider component
export const ChatProvider = ({ children }) => {
  const { user } = useUser();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.BACKEND_URL || 'http://localhost:5004');
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  // Set up socket event listeners
  useEffect(() => {
    if (socket && user) {
      // Join user's room for private messages
      socket.emit('join_room', user.id);

      // Listen for new messages
      socket.on('receive_message', (data) => {
        if (activeConversation && 
            (data.sender === activeConversation._id || data.recipient === activeConversation._id)) {
          // Add to current conversation messages
          setMessages(prev => [...prev, data]);
          
          // Mark as read if it's the active conversation
          if (data.sender === activeConversation._id) {
            markMessagesAsRead(activeConversation._id);
          }
        } else {
          // Update unread counts for other conversations
          setUnreadCounts(prev => ({
            ...prev,
            [data.sender]: (prev[data.sender] || 0) + 1
          }));
        }

        // Update conversations list
        fetchConversations();
      });

      return () => {
        socket.off('receive_message');
      };
    }
  }, [socket, user, activeConversation]);

  // Fetch user's conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5004/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setConversations(response.data.data);
      
      // Update unread counts
      const counts = {};
      response.data.data.forEach(conv => {
        counts[conv._id] = conv.unreadCount.get(user.id) || 0;
      });
      setUnreadCounts(counts);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch conversations');
      setLoading(false);
      console.error('Error fetching conversations:', err);
    }
  }, [user]);

  // Fetch conversation messages
  const fetchMessages = useCallback(async (userId) => {
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5004/api/messages/conversation/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(response.data.data.messages);
      setActiveConversation(response.data.data.conversation);
      
      // Reset unread count for this conversation
      setUnreadCounts(prev => ({
        ...prev,
        [userId]: 0
      }));
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch messages');
      setLoading(false);
      console.error('Error fetching messages:', err);
    }
  }, [user]);

  // Send a message
  const sendMessage = useCallback(async (recipientId, content) => {
    if (!user || !socket) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5004/api/messages', 
        { recipientId, content },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Add to messages
      setMessages(prev => [...prev, response.data.data]);

      // Emit socket event
      socket.emit('send_message', {
        roomId: recipientId,
        message: response.data.data
      });

      return response.data.data;
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
      throw err;
    }
  }, [user, socket]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (conversationId) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5004/api/messages/read/${conversationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update unread counts
      setUnreadCounts(prev => ({
        ...prev,
        [conversationId]: 0
      }));
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, [user]);

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  // Calculate total unread messages
  const totalUnreadMessages = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      messages,
      loading,
      error,
      unreadCounts,
      totalUnreadMessages,
      fetchConversations,
      fetchMessages,
      sendMessage,
      markMessagesAsRead,
      setActiveConversation
    }}>
      {children}
    </ChatContext.Provider>
  );
};